/**
 * Socket Auth Service
 *
 * Description:
 * Manages real-time user authentication; friend's activity, including tracking statuses, friend requests, and room management.
 */

import type { ObjectId, QueryOptions } from "mongoose";
import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
import type { FriendCredentials, UserCredentials, ActivityStatuses } from "@qc/typescript/typings/UserCredentials";
import type { UserDocFriends, UserDoc, UserClaims } from "@authFeat/typings/User";

import type { ManageFriendRequestEventDto } from "@qc/typescript/dtos/ManageFriendEventDto";
import type { NotificationTypes, Notification } from "@qc/typescript/dtos/NotificationsDto"

import { startSession } from "mongoose"

import { AuthEvent } from "@qc/constants";
import { USER_NOT_FOUND_IN_SYSTEM_MESSAGE } from "@authFeat/constants/USER_NOT_FOUND_MESSAGE";

import { logger } from "@qc/utils";
import { handleSocketError, SocketError } from "@utils/handleError";
import handleMultipleTransactionPromises from "@utils/handleMultipleTransactionPromises";
import getFriendRoom from "@authFeatSocket/utils/getFriendRoom";
import getSocketId from "@authFeatSocket/utils/getSocketId";
import getUserSessionActivity from "@authFeat/utils/getUserSessionActivity";

import { getUserFriends, getUser, updateUserFriends, updateUserNotifications } from "@authFeat/services/authService";
import { redisClient } from "@cache";

export const KEY = (userId: ObjectId | string) => ({
  status: `user:${userId.toString()}:activity:status`,
  inactivityTimestamp: `user:${userId.toString()}:activity:inactivity_timestamp`
});

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
  public async initializeFriends({ member_id }: { member_id: string }, callback: SocketCallback) {
    logger.debug("socket initializeFriends:", { member_id });
  
    try {
      const user = this.socket.userDecodedClaims!;
      if (member_id !== user.member_id) throw new SocketError("Access Denied", "forbidden"); // Why not.

      const userFriends = await getUserFriends(user.sub, { forClient: "pending", lean: true });
      let initFriends: UserCredentials["friends"] = {
        pending: Object.fromEntries(userFriends.pending),
        list: {}
      };

      if (!userFriends.list.size) {
        this.cacheUserActivityStatus("online", user);

        return callback({
          status: "ok",
          message: "Only pending friends was initialized, no added friends was found.",
          friends: initFriends
        });
      } else {
        for (const [key, friend] of userFriends.list as unknown as [string, FriendCredentials & { _id: ObjectId }][]) {
          // Emits the user's new status to their friends and also joins friend rooms only the friend is online.
          await this.emitFriendActivity(user, "online", friend as any);

          const [sessionActivity, lastPrivateChatMsg] = await Promise.all([
            getUserSessionActivity(friend._id),
            redisClient.get(`chat:${getFriendRoom(user.member_id, friend.member_id)}:last_message`)
          ]);

          friend.activity = sessionActivity;
          if (lastPrivateChatMsg) friend.last_chat_message = lastPrivateChatMsg;
          delete (friend as any)._id;
          
          initFriends.list[key] = friend;
        }

        return callback({
          status: "ok",
          message: "Pending and added friends, as well as other credentials, successfully initialized.",
          friends: initFriends
        });
      }
    } catch (error: any) {
      return handleSocketError(callback, error, "initializeFriends service error.");
    }
  }

  /**
   * Manages friend request actions including sending, accepting, and declining friend requests.
   */
  public async manageFriendRequest({ action_type, friend }: ManageFriendRequestEventDto, callback: SocketCallback) {
    logger.debug("socket manageFriendRequest:", { action_type, friend });

    try {
      const user = this.socket.userDecodedClaims!,
        recipient = await getUser("username", friend.username, { lean: true });
      if (!recipient)
        throw new SocketError(USER_NOT_FOUND_IN_SYSTEM_MESSAGE, "not found");

      // User sending a friend request.
      if (action_type === "request") {
        if (!recipient.email_verified)
          throw new SocketError(
            "This user isn't verified. To add a friend, they must be verified.",
            "conflict"
          );

        const session = await startSession();

        const updatedFriends = await session.withTransaction(async () => {
          // Adds the pending friend to the sender.
          const updatedFriends = await updateUserFriends(
            { by: "_id", value: user.sub },
            { $set: { [`pending.${recipient.member_id}`]: recipient._id } },
            { session, new: true, projection: "pending" }
          );

          // Sends the friend request to the recipient and adds it to their notifications.
          await this.emitNotification(
            recipient,
            {
              type: "friend_request",
              title: user.username,
              message: "Sent you a friend request."
            },
            { session }
          );

          return updatedFriends;
        }).finally(() => session.endSession());

        return callback({
          status: "ok",
          message: `Friend request successfully sent to ${recipient.username}.`,
          pending_friends: updatedFriends!.pending
        });
      }

      // User(recipient) accepting the friend request.
      if (action_type === "add") {
        const initialSender = recipient;

        const session = await startSession();

        const [_, updatedFriends, initialSenderUpdateFriends ] = await session.withTransaction(async () =>
          handleMultipleTransactionPromises([
            // Removes previously sent friend request from the recipient(user in this case).
            updateUserNotifications(
              { by: "_id", value: user.sub },
              { $pull: { friend_requests: initialSender._id } },
              { session }
            ),
            ...[user, initialSender].map(async (issuer, i) => {
              const id = issuer._id || (issuer as UserClaims).sub,
                newFriend = i === 0 ? initialSender : user;

              const updatedFriends = await updateUserFriends(
                { by: "_id", value: id },
                {
                  // Removes the pending friend from the initial sender of the request.
                  ...(i === 1 && {
                    $unset: { [`pending.${user.member_id}`]: "" }
                  }),
                  // Adds both users to their corresponding friend list.
                  $set: {
                    ...(i === 0
                      ? {
                          [`list.${initialSender.member_id}`]: newFriend._id
                        }
                      : {
                          [`list.${user.member_id}`]: (newFriend as UserClaims).sub
                        })
                  }
                },
                { session, projection: "list", new: true, lean: true }
              );

              // Adds the activity needed for the client when there is a new friend since the friend won't be initialized.
              const activity = await getUserSessionActivity(id),
                serializedList = Object.fromEntries(updatedFriends.list);
              (serializedList[newFriend.member_id] as any) = { ...serializedList[newFriend.member_id], activity };
              (updatedFriends.list as any) = serializedList;

              return updatedFriends;
            })
          ])
        ).finally(() => session.endSession());

        const friendSocketId = await getSocketId(initialSender.member_id);
        if (friendSocketId)
          this.emitFriendUpdate(
            {
              update: { list: initialSenderUpdateFriends.list },
              remove: { pending: user.member_id }
            },
            friendSocketId
          );
        this.emitFriendUpdate({ update: { list: updatedFriends.list } });

        // Sends the info notification to the initial sender.
        await this.emitNotification(
          initialSender,
          { type: "general", title: "Accepted", message: `${user.username} accepted your friend request.` }
        );

        return callback({
          status: "ok", 
          message: `Successfully added ${initialSender.username} as a friend.`
        });
      }

      // User declining the friend request.
      if (action_type === "decline") {
        const initialSender = recipient,
          session = await startSession();

        await session.withTransaction(async () => 
          handleMultipleTransactionPromises([
            // Removes the previously sent friend request from the recipient(user in this case).
            updateUserNotifications(
              { by: "_id", value: user.sub },
              { $pull: { friend_requests: initialSender._id } },
              { session }
            ),
            // Removes the pending friend from the initial sender of the request.
            updateUserFriends(
              { by: "_id", value: initialSender._id },
              { $unset: { [`pending.${user.member_id}`]: "" } },
              { session }
            )
          ])
        ).finally(() => session.endSession());

        const socketId = await getSocketId(initialSender.member_id);
        if (socketId) this.emitFriendUpdate({ remove: { pending: user.member_id } }, socketId);

        // Issues the general notification to the initial sender without the NEW_NOTIFICATION event call.
        await this.emitNotification(
          initialSender,
          { type: "general", title: "Declined", message: `${user.username} declined your friend request.` },
          { silent: true }
        );

        return callback({
          status: "ok", 
          message: `Declined ${recipient.username}'s friend request.`
        });
      }

      return callback({
        status: "bad request", 
        message: "There was no data provided or the action_type is invalid."
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "manageFriendRequest service error.");
    }
  }

  /**
   * Deletes a friend from both the user's friend list and the friend. 
   */
  public async unfriend({ member_id }: { member_id: string }, callback: SocketCallback) {
    logger.debug("socket unfriend:", { member_id });

    try {
      const user = this.socket.userDecodedClaims!;

      const { _id: friendId } = await getUser("member_id", member_id, {
        projection: "_id",
        lean: true,
        throwDefault404: true
      });

      const session = await startSession();

      await session.withTransaction(async () =>
        handleMultipleTransactionPromises([
          updateUserFriends(
            { by: "_id", value: user.sub },
            { $unset: { [`list.${member_id}`]: "" } },
            { session  }
          ),
          updateUserFriends(
            { by: "_id", value: friendId },
            { $unset: { [`list.${user.member_id}`]: "" } },
            { session }
          )
        ])
      ).finally(() => session.endSession());

      const friendSocketId = await getSocketId(member_id);
      if (friendSocketId) this.emitFriendUpdate({ remove: { list: user.member_id } }, friendSocketId);
      this.emitFriendUpdate({ remove: { list: member_id } });

      await this.emitNotification(
        { _id: friendId, member_id },
        { type: "general", title: "Unfriended", message: `${user.username} just unfriended you.` },
        { silent: true }
      )
  
      return callback({
        status: "ok",
        message: "Successfully deleted friend from friend list."
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "unfriend service error.");
    }
  }

  /**
   * Handles new incoming activity of the user (inactivity_timestamp, and user status). 
   */
  public async userActivity({ status }: { status: ActivityStatuses }, callback: SocketCallback) {
    logger.debug("socket userActivity:", { status });

    try {
      const user = this.socket.userDecodedClaims!,
        userFriends = await getUserFriends(user.sub, { lean: true });

      // The client only shows the timestamp if their away or offline because the user would just be "Last Seen Just Now" if they're online.
      if (["away", "offline"].includes(status))
        await redisClient.set(`user:${user.sub}:activity:inactivity_timestamp`, new Date().toISOString(), { EX: 60 * 60 * 24 * 7 }); // 1 week.

      await this.emitFriendActivity(user, status, userFriends.list.values());

      return callback({
        status: "ok",
        message:
          "Activity updated successfully. Friend events and room management also completed successfully."
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "newActivity service error.");
    }
  }

  /**
   * Handles socket instance disconnection; Sends that they're offline to all friends of the user.
   */
  public async disconnect() {
    logger.debug(`Auth socket instance disconnected; ${this.socket.id}.`);

    try {
      const user = this.socket.userDecodedClaims!;

      if (user) {
        const userFriends = await getUserFriends(user.sub, { lean: true });

        await redisClient.del(`user:${user.member_id}:socket_id`)

        const promises: Promise<void>[] = [];
        for (const friend of userFriends.list.values()) {
          promises.push(this.emitFriendActivity(user, "offline", friend));
        }
        await Promise.all(promises);
      }
    } catch (error: any) {
      logger.error("auth/disconnect service error:\n", error.message);
    }
  }

  /**
   * Emits the `friends_update` event.
   */
  public emitFriendUpdate(
    updatedFriends: { update: Partial<UserDocFriends>; } | { remove: { pending?: string; list?: string } },
    socketId?: string | null
  ) {
    try {
      if (socketId) this.io.to(socketId).emit(AuthEvent.FRIENDS_UPDATE, updatedFriends);
      else this.socket.emit(AuthEvent.FRIENDS_UPDATE, updatedFriends);
    } catch (error: any) {
      logger.error("emitFriendUpdate service error:\n", error.message);
      throw error;
    }
  }

  /**
   * Updates the user activity status and sends an the updated status to a friend(s) of the user.
   */
  public async emitFriendActivity(
    user: UserClaims,
    status: ActivityStatuses,
    friend: UserDoc | IterableIterator<UserDoc>,
  ) {
    try {
      const handleActivity = async (friend: UserDoc) => {
        const friendId = friend.member_id,
          userId = user.member_id;

        const friendSocketId = await getSocketId(friendId);
        // If there is a socketId, it means they're connected, so they're online or away.
        if (friendSocketId)
          this.io
            .to(friendSocketId)
            .emit(AuthEvent.FRIEND_ACTIVITY, { member_id: userId, status });
      }

      await this.cacheUserActivityStatus(status, user);

      if ((typeof friend as any)[Symbol.iterator] === "function") {
        for (const fri of friend as Iterable<UserDoc>) await handleActivity(fri);
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
   * @param options.silent (Optional) When `true` the `NEW_NOTIFICATION` event is not emitted, only the database is updated.
   */
  public async emitNotification(
    to: Partial<UserClaims | UserDoc>,
    notification: Omit<Notification, "type" | "notification_id" | "created_at"> & { type: NotificationTypes | "friend_request" },
    options: QueryOptions & { silent?: boolean } = {}
  ) {
    try {
      const { type } = notification,
        { silent, ...restOpts } = options;

      await updateUserNotifications(
        { by: "_id", value: to._id || (to as UserClaims).sub },
        {
          $push: {
            ...(type === "friend_request"
              ? { friend_requests: this.socket.userDecodedClaims!.sub }
              : { [`notifications.${type}`]: notification })
          }
        },
        restOpts
      );

      if (!silent) {
        const socketId = await getSocketId(to.member_id!);
        if (socketId) this.io.to(socketId).emit(AuthEvent.NEW_NOTIFICATION, { notification });
      }
    } catch (error: any) {
      logger.error("emitNotification service error:\n", error.message);
      throw error;
    }
  }

  /**
   * Stores the user's activity status in the cache only for `online` and `away` for up to 1.5 days.
   * If no cached value exists, the user is offline.
   */
  private async cacheUserActivityStatus(status: ActivityStatuses, user: UserClaims) {
    try {
      if (status === "offline") await redisClient.del(KEY(user.sub).status);
      else await redisClient.set(KEY(user.sub).status, status, { EX: 60 * 60 * 36 }); // 1.5 days.
    } catch (error: any) {
      logger.error("cacheUserActivityStatus service error:\n", error.message);
      throw error;
    }
  }
}
