/**
 * Socket Auth Service
 *
 * Description:
 * Manages real-time user authentication; friend's activity, including tracking statuses, friend requests, and room management.
 */

import type { QueryOptions } from "mongoose";
import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
import type { FriendCredentials, UserCredentials, ActivityStatuses } from "@qc/typescript/typings/UserCredentials";
import type { UserDocFriends, UserDoc, UserClaims } from "@authFeat/typings/User";

import type { ManageFriendRequestEventDto } from "@qc/typescript/dtos/ManageFriendEventDto";
import type { NotificationTypes, Notification } from "@qc/typescript/dtos/NotificationsDto"

import { startSession } from "mongoose"

import { AuthEvent } from "@qc/constants";

import { logger } from "@qc/utils";
import { handleSocketError, SocketError } from "@utils/handleError";
import handleMultipleTransactionPromises from "@utils/handleMultipleTransactionPromises";
import getFriendRoom from "@authFeatSocket/utils/getFriendRoom";
import getSocketId from "@authFeatSocket/utils/getSocketId";

import { getUserFriends, getUser, updateUserFriends, updateUserNotifications, updateUserActivity } from "@authFeat/services/authService";
import { redisClient } from "@cache";

const FRIENDS_NOT_FOUND_MESSAGE = "Unexpectedly couldn't find the user's friends after validation.";

export default class SocketAuthService {
  private socket: Socket;
  private io: Namespace;

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
  }

  /**
   * Initializes friend activity statuses and joins friend rooms for tracking statuses and private messaging, etc.
   * Sets the status for each friend and joins their appropriate rooms only if the friend is online.
   * 
   * Should only be used on login.
   */
  async initializeFriends({ verification_token }: { verification_token: string }, callback: SocketCallback) {
    logger.debug("socket initializeFriends:", { verification_token });

    try {
      const user = this.socket.decodedClaims!;

      const userFriends = await getUserFriends(user.sub);
      if (!userFriends) throw new SocketError(FRIENDS_NOT_FOUND_MESSAGE, "not found"); // TODO: Make this a default error it throws if you continue to do this.

      let initFriends: UserCredentials["friends"] = { 
        pending: userFriends.pending as any,
        list: {} 
      };

      if (!userFriends.list.size) {
        await updateUserActivity({ by: "_id", value: user.sub }, { status: "online" });

        return callback({
          status: "ok",
          message: "Only pending friends was initialized, no added friends was found.",
          friends: initFriends
        });
      } else {
        for (const [key, friend] of userFriends.list) {
          // Emits the user's new status to their friends and also joins friend rooms only the friend is online.
          await this.emitFriendActivity(user, "online", friend);

          initFriends.list[key] = (friend as unknown) as FriendCredentials;
        }

        return callback({
          status: "ok",
          message: "Pending and added friends, as well as friend rooms and friend statuses, successfully initialized.",
          friends: initFriends,
        });
      }
    } catch (error: any) {
      return handleSocketError(callback, error, "initializeFriends service error.");
    }
  }

  /**
   * Manages friend request actions including sending, accepting, and declining friend requests.
   */
  async manageFriendRequest({ action_type, friend }: ManageFriendRequestEventDto, callback: SocketCallback) {
    logger.debug("socket manageFriendRequest:", { action_type, friend });

    try {
      const user = this.socket.decodedClaims!,
        recipient = await getUser("username", friend.username);
      if (!recipient) 
        throw new SocketError("Unexpectedly we couldn't find this user in our system.", "not found");

      const userFriends = await getUserFriends(user.sub);
      if (!userFriends) throw new SocketError(FRIENDS_NOT_FOUND_MESSAGE, "not found");

      // User sending a friend request.
      if (action_type === "request") {
        if (!recipient.email_verified)
          throw new SocketError(
            "This user isn't verified. To add a friend, they must be verified.",
            "unauthorized"
          );

        const session = await startSession();

        let updatedFriends: UserDocFriends;
        await session.withTransaction(async () => {
          // Adds the pending friend to the sender.
          updatedFriends = await updateUserFriends(
            { by: "_id", value: user.sub },
            { $set: { [`pending.${recipient.verification_token}`]: recipient._id } },
            { session, new: true }
          );

          // Sends the friend request to the recipient and adds it to their notifications.
          await this.#emitNotification(
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
          friends: updatedFriends!
        });
      }

      // User(recipient) accepting the friend request.
      if (action_type === "add") {
        const initialSender = recipient;
        let senderSocketId: string | null = null;

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
              const updatedFriends = await updateUserFriends(
                { by: "_id", value: issuer._id || (issuer as UserClaims).sub },
                {
                  // Removes the pending friend from the initial sender of the request.
                  ...(i === 1 && {
                    $unset: { [`pending.${user.verification_token}`]: "" }
                  }),
                  // Adds both users to their corresponding friend list.
                  $set: {
                    ...(i === 0
                      ? {
                          [`list.${initialSender.verification_token}`]: initialSender._id
                        }
                      : {
                          [`list.${user.verification_token}`]: user._id
                        })
                  },
                },
                { session, new: true }
              );

              if (i === 1) {
                senderSocketId = await getSocketId(initialSender.verification_token);
                if (senderSocketId) this.io.to(senderSocketId).emit(AuthEvent.FRIENDS_UPDATE, { friends: updatedFriends });
              } else {
                this.socket.emit(AuthEvent.FRIENDS_UPDATE, { friends: updatedFriends });
              }
            }),
            // Sends the info notification to the initial sender.
            this.#emitNotification(
              initialSender,
              { type: "general", title: "Accepted", message: `${user.username} accepted your friend request.` },
              { session }
            )
          ]);
        }).finally(() => session.endSession());

        // If the sender is online or away (so they're connected and have a socketId), they join a room with each other.
        const friendRoom = getFriendRoom(user.verification_token, initialSender.verification_token)
        if (senderSocketId) {
          this.socket.join(friendRoom);
          this.io.sockets.get(senderSocketId)?.join(friendRoom);
        } else {
          this.socket.leave(friendRoom);
        }

        return callback({
          status: "ok", 
          message: `Successfully added ${initialSender.username} as a friend.`,
          joined_room: !!senderSocketId
        });
      }

      // User declining the friend request.
      if (action_type === "decline") {
        const initialSender = recipient,
          session = await startSession();

        const updatedFriends = await session.withTransaction(async () => {
          const silentNotification = { title: "Declined", message: `${user.username} declined your friend request.` };

          const [_, updatedFriends] = await handleMultipleTransactionPromises([
            // Removes the previously sent friend request from the recipient(user in this case).
            updateUserNotifications(
              { by: "_id", value: user.sub },
              { $pull: { friend_requests: initialSender._id } },
              { session }
            ),
            // Removes the pending friend from the initial sender of the request.
            updateUserFriends(
              { by: "_id", value: initialSender._id },
              { $unset: { [`pending.${user.verification_token}`]: "" } },
              { session, new: true }
            ),
            // Issues the info notification to the initial sender without the NEW_NOTIFICATION event call.
            updateUserNotifications(
              { by: "_id", value: initialSender._id },
              { $push: { "notifications.general": silentNotification } },
              { session }
            ),
          ]);

          return updatedFriends;
        }).finally(() => session.endSession());

        const socketId = await getSocketId(initialSender.verification_token);
        if (socketId) this.io.to(socketId).emit(AuthEvent.FRIENDS_UPDATE, { friends: updatedFriends });

        return callback({
          status: "ok", 
          message: `Declined ${recipient.username}'s friend request.`,
        });
      }
    } catch (error: any) {
      return handleSocketError(callback, error, "manageFriends service error.");
    }
  }

  /**
   * Handles new incoming activity of the user. 
   */
  async userActivity({ status }: { status: ActivityStatuses }, callback: SocketCallback) {
    logger.debug("socket userActivity:", { status });

    try {
      const user = this.socket.decodedClaims!

      const userFriends = await getUserFriends(user.sub);
      if (!userFriends) throw new SocketError(FRIENDS_NOT_FOUND_MESSAGE, "not found");

      await this.emitFriendActivity(user, status, userFriends.list.values());

      return callback({
        status: "ok",
        message:
          "Activity updated successfully. Friend events and room management also completed successfully.",
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "newActivity service error.");
    }
  }

  /**
   * Handles socket instance disconnection; Sends that they're offline to all friends of the user.
   */
  async disconnect() {
    logger.debug(`Socket disconnected; ${this.socket.id}.`);

    try {
      const user = this.socket.decodedClaims!;

      if (user) {
        const userFriends = await getUserFriends(user.sub);
        if (!userFriends) throw new SocketError(FRIENDS_NOT_FOUND_MESSAGE, "not found");

        await redisClient.del(`user:${user.verification_token}:socket_id`)
        for (const friend of userFriends.list.values()) {
          await this.emitFriendActivity(user, "offline", friend);
        }
      }
    } catch (error: any) {
      logger.error("auth/disconnect service error:\n", error.message);
    }
  }

  /**
   * Updates the user activity status and sends an the updated status to a friend(s) of the user and 
   * also join and leaves friend rooms if needed.
   */
  async emitFriendActivity(
    user: UserClaims,
    status: ActivityStatuses,
    friend: UserDoc | BuiltinIterator<UserDoc, undefined, any>,
  ) {
    try {
      const handleActivity = async (friend: UserDoc) => {
        const friendToken = friend.verification_token,
          userToken = user.verification_token;

        const friendSocketId = await getSocketId(friendToken);
        // If there is a socketId, it means they're connected, so they're online or away.
        if (friendSocketId && friend.activity.status === "online") {
          const friendRoom = getFriendRoom(userToken, friendToken)

          // If the current user is not going offline (disconnecting).
          if (status !== "offline") {
            // Joins their friend room only if the friend is online.
            this.socket.join(friendRoom);

            // If the friend is online emit to them the new status of the current user.
            this.socket
              .to(friendSocketId)
              .emit(AuthEvent.FRIEND_ACTIVITY, { verification_token: userToken, status });
          }

          // For the friend, if the current user's status is offline or away it leaves the room also.
          const friendSocket = this.io.sockets.get(friendSocketId);
          if (["offline", "away"].includes(status)) {
            friendSocket?.leave(friendRoom);
          } else {
            friendSocket?.join(friendRoom);
          }
        } else {
          // Leaves if the socketId is not found or the friend's status is offline or away.
          if (status !== "offline") this.socket.leave(getFriendRoom(userToken, friendToken));
        }
      }

      await updateUserActivity({ by: "_id", value: user.sub }, { status });

      if ((typeof friend as any)[Symbol.iterator] === "function") {
        for (const fri of friend as Iterable<UserDoc>) {
          await handleActivity(fri);
        }
      } else {
        await handleActivity(friend as UserDoc);
      }
    } catch (error: any) {
      logger.error("emitFriendActivity service error:\n", error.message);
      throw error;
    }
  }

  /**
   * Sends a notification to a connected user. Supports all `NotificationTypes`, and even friend requests
   * to allow the client-side the ability to send the add or decline event.
   */
  async #emitNotification(
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

      const socketId = await getSocketId(to.verification_token!);
      if (socketId) this.io.to(socketId).emit(AuthEvent.NEW_NOTIFICATION, { notification });
    } catch (error: any) {
      logger.error("emitNotification service error:\n", error.message);
      throw error;
    }
  }
}
