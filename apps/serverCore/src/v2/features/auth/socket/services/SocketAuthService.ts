/**
 * Socket Auth Service
 *
 * Description:
 * Manages real-time user authentication and management.
 */

import type { QueryOptions } from "mongoose";
import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import type { UserClaims, UserDoc } from "@authFeat/typings/User";
import type { ManageFriendRoomDto, ManageFriendRequestDto } from "@qc/typescript/dtos/ManageFriendDto";
import type { NotificationTypes, Notification } from "@qc/typescript/dtos/NotificationsDto"

import { startSession } from "mongoose"

import { AuthEvent } from "@qc/constants";

import { logger, getUserActivityStatus } from "@qc/utils";
import { handleSocketError } from "@utils/handleError";
import handleMultipleTransactionPromises from "@utils/handleMultipleTransactionPromises";
import getFriendRoom from "@authFeatSocket/utils/getFriendRoom";
import getSocketId from "@authFeatSocket/utils/getSocketId";

import { getUser, updateUserNotifications, updateUserCredentials, updateUserActivity } from "@authFeat/services/authService";
import { redisClient } from "@cache";

export default class SocketAuthService {
  private socket: Socket;
  private io: Namespace;

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
  }

  /**
   * Initializes friend activity statuses and joins friend rooms for tracking statuses and private messaging.
   * Sets the status for each friend and joins their appropriate rooms only if the friends are online.
   */
  async initializeFriends({ friends }: { friends: FriendCredentials[] }, callback: SocketCallback) {
    logger.debug("initializeFriends:", { friends });

    try {
      const user = this.socket.decodedClaims!;

      if (friends.length) {
        for (const friend of friends) {
          const status = getUserActivityStatus(friend.activity_timestamp, friend.verification_token);
          // Joins their friend room only if they are online.
          if (status === "online")
            this.socket.join(getFriendRoom(user.verification_token, friend.verification_token!)); // If they're online, they're verified.

          friend.status = status;
        }
        this.socket.emit(AuthEvent.FRIENDS_UPDATE, { friends });
      }

      return callback({
        status: "ok",
        message: "Friend rooms and friend statuses successfully initialized.",
      });
    } catch (error: any) {
      return handleSocketError(callback, error, { from: "initializeFriends service error." });
    }
  }

  /**
   * Joins a friend room for tracking activity status and private messaging or leaving a friend room.
   * If the friend is verified, the user joins a room named with their verification tokens.
   */
  // TODO: I don't know if I need this method.
  async manageFriendRoom({ action_type, friend }: ManageFriendRoomDto, callback: SocketCallback) {
    console.log("MANAGE FRIENDS ROOM");

    if (!["join", "leave"].includes(action_type))
      return handleSocketError(
        callback,
        Error(`There was no data provide for a join or the type isn't valid; must be "leave" or "join".`),
        { status: "bad request", from: "manageRoom service error." }
      );

    try {
      // TODO: Might need to handle better like on the client (You don't need to show this message just when the user try to send a message on the client (go to message screen))?
      if (!friend.verification_token)
        return callback({ status: "unauthorized", ERROR: "The friend isn't verified." });

      this.socket[action_type](
        getFriendRoom(
          this.socket.decodedClaims!.verification_token,
          friend.verification_token
        )
      );

      return callback({
        status: "ok",
        message: `Successfully joined the friend room with ${friend.username}.`,
      });
    } catch (error: any) {
      return handleSocketError(callback, error, { from: "initializeFriends service error." });
    }
  }

  /**
   * Manages friend request actions including sending, accepting, and declining friend requests.
   */
  async manageFriendRequest({ action_type, friend }: ManageFriendRequestDto, callback: SocketCallback) {
    logger.debug("manageFriendRequest:", { action_type, friend });

    try {
      const user = this.socket.decodedClaims!,
        recipient = await getUser("username", friend.username);
      if (!recipient) 
        return callback({ status: "not found", ERROR: "Unexpectedly we couldn't find this user in our system." });

      // User sending a friend request.
      if (action_type === "request") {
        if (!recipient.email_verified)
          return callback({
            status: "unauthorized",
            ERROR: "This user isn't verified. To add a friend, they must be verified.",
          });

        const session = await startSession();

        let newCredentials: UserDoc;
        await session.withTransaction(async () => {
          // Adds the pending friend to the sender.
          newCredentials = await updateUserCredentials(
            { by: "_id", value: user.sub },
            { $push: { "friends.pending": recipient._id } },
            { session, new: true, forClient: true }
          );

          // Sends the friend request to the recipient and adds it to their notifications.
          await this.#sendUserNotification(
            recipient,
            {
              type: "friend_request",
              title: user.username,
              message: "Sent you a friend request.",
            },
            { session }
          );
        }).finally(() => session.endSession());

        return callback({
          status: "ok",
          message: `Friend request successfully sent to ${recipient.username}.`,
          updated_user: newCredentials!
        });
      }

      // User(recipient) accepting the friend request.
      if (action_type === "add") {
        const initialSender = recipient;

        const session = await startSession();

        await session.withTransaction(async () => {
          await handleMultipleTransactionPromises([
            // Removes previously sent friend request from the recipient(user in this case).
            updateUserNotifications(
              { by: "_id", value: user.sub },
              { $pull: { friend_requests: initialSender._id } },
              { session }
            ),
            ...[user, initialSender].map(async (issuer, i) => {
              const newCredentials = await updateUserCredentials(
                { by: "username", value: issuer.username },
                {
                  // Removes the pending friend from the initial sender of the request.
                  ...(i === 1 && {
                    $pull: { "friends.pending": user._id },
                  }),
                  // Adds both users to their corresponding friend list.
                  $push: {
                    "friends.list": i === 0 ? initialSender._id : user._id,
                  }
                },
                { session, new: true }
              );

              if (i === 1) {
                const socketId = await getSocketId(initialSender.id);
                this.io.to(socketId).emit(AuthEvent.FRIENDS_UPDATE, { friends: newCredentials.friends });
              } else {
                this.socket.emit(AuthEvent.FRIENDS_UPDATE, { friends: newCredentials.friends });
              }
            }),
            // Sends the info notification to the initial sender.
            this.#sendUserNotification(
              initialSender,
              { type: "general", title: "Accepted", message: `${user.username} accepted your friend request.` },
              { session }
            )
          ]);

          // TODO: Join the friend room here and check their status?

        }).finally(() => session.endSession());

        return callback({
          status: "ok", 
          message: `Successfully added ${initialSender.username} as a friend.`,
        });
      }

      // User declining the friend request.
      if (action_type === "decline") {
        const initialSender = recipient,
          session = await startSession();

        await session.withTransaction(async () => {
          const silentNotification = { title: "Declined", message: `${user.username} declined your friend request.` };

          const [_, newCredentials] = await handleMultipleTransactionPromises([
            // Removes the previously sent friend request from the recipient(user in this case).
            updateUserNotifications(
              { by: "_id", value: user.sub },
              { $pull: { friend_requests: initialSender._id } },
              { session }
            ),
            // Removes the pending friend from the initial sender of the request.
            updateUserCredentials(
              { by: "_id", value: initialSender._id },
              { $pull: { "friends.pending": user.sub } },
              { session, new: true, forClient: true }
            ),
            // Issues the info notification to the initial sender without the NEW_NOTIFICATION event call.
            updateUserNotifications(
              { by: "_id", value: initialSender._id },
              {
                $push: { "notifications.general": silentNotification },
              },
              { session }
            ),
          ]);

          const socketId = await getSocketId(initialSender.id)
          this.io.to(socketId).emit(AuthEvent.FRIENDS_UPDATE, { friends: newCredentials.friends });
        }).finally(() => session.endSession());

        return callback({
          status: "ok", 
          message: `Declined ${recipient.username}'s friend request.`,
        });
      }
    } catch (error: any) {
      return handleSocketError(callback, error, { from: "manageFriends service error." });
    }
  }

  /**
   *  Handles socket instance disconnection...
   */
  async disconnect({ friends }: { friends: FriendCredentials[] }, callback: SocketCallback) {
    logger.debug(`Socket disconnected; ${this.socket.id}.`);
    const user = this.socket.decodedClaims!;

    try {
      await redisClient.del(`user:${user.sub}:socket_id`)
      for (const friend of friends) {
        await this.emitFriendActivity(
          user.verification_token,
          friend.verification_token!,
          user,
          null // null activity timestamp for status offline.
        );
      }
    } catch (error: any) {
      // return handleSocketError(callback, error, { from: "auth/disconnect service error." });
      logger.error("auth/disconnect service error:\n", error.message);
    }
  }

  /**
   * Sends an updated activity status to the friend of the user.
   */
  // TODO: Change name.
  async emitFriendActivity(
    userVerToken: string,
    friendVerToken: string,
    user: UserClaims,
    timestamp: Date | null = new Date()
  ) {
    try {
    const updatedActivity = await updateUserActivity(
      { by: "_id", value: user.sub },
      { activity_timestamp: timestamp },
      { new: true }
    );

    const status = getUserActivityStatus(
      updatedActivity!.activity_timestamp,
      user.verification_token
    );
    // TODO: Could find a way to use FRIENDS_UPDATE since init friends uses it for statuses.
    this.socket
      .in(getFriendRoom(userVerToken, friendVerToken))
      // .emit(AuthEvent.FRIENDS_UPDATE, { friends: updatedUser!.friends })
      .emit(AuthEvent.FRIEND_ACTIVITY, { username: user.username, status }); // Could just send by the entire friend.
    } catch (error: any) {
      logger.error("emitFriendActivity service error:\n", error.message);
      throw error;
    }
  }

  /**
   * Emits new_notification to either the current user, their friend, or both.
   * To add a friend 
   */
  async #sendUserNotification(
    to: Partial<UserClaims | UserDoc>,
    notification: Omit<Notification, "type" | "notification_id" | "created_at"> & { type: NotificationTypes | "friend_request" },
    queryOptions?: QueryOptions
  ) {
    try {
      const { type } = notification;

      await updateUserNotifications(
        { by: "_id", value: to._id.toString() },
        {
          $push: {
            ...(type === "friend_request"
              ? { friend_requests: this.socket.decodedClaims!.sub }
              : { [`notifications.${type}`]: notification }),
          }
        },
        queryOptions
      );

      const socketId = await getSocketId(to._id);
      this.io.to(socketId).emit(AuthEvent.NEW_NOTIFICATION, { notification });
    } catch (error: any) {
      logger.error("sendUserNotification service error:\n", error.message);
      throw error;
    }
  }
}
