/**
 * Socket Chat Service
 *
 * Description:
 * Handles real-time chat functionalities including managing rooms, user typing status, and global and private messaging.
 */

import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
import type { ChatMessage } from "@chatFeat/typings/ChatMessage";
import type { LastChatMessageDto } from "@qc/typescript/dtos/ChatMessageEventDto";

import type ManageChatRoomEventDto  from "@qc/typescript/dtos/ManageChatRoomEventDto";
import type TypingEventDto from "@qc/typescript/dtos/TypingEventDto";
import type ChatMessageEventDto from "@qc/typescript/dtos/ChatMessageEventDto";

import { ChatEvent } from "@qc/constants";
import GENERAL_BAD_REQUEST_MESSAGE from "@constants/GENERAL_BAD_REQUEST_MESSAGE";

import { logger } from "@qc/utils";
import { handleSocketError, SocketError } from "@utils/handleError";
import chatRoomsUtils from "@chatFeat/utils/ChatRoomsUtils";
import getFriendRoom from "@authFeatSocket/utils/getFriendRoom";

import { getChatMessages, archiveChatMessageQueue } from "@chatFeat/services/chatService";
import { getUserFriends } from "@authFeat/services/authService";
import { redisClient } from "@cache";

const MANAGE_CHAT_ROOM_ACTIONS = ["join", "leave"] as const;

export default class SocketChatService {
  private socket: Socket;
  private io: Namespace;
  private duplicateMessages: { last: string | null; count: number };

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
    this.duplicateMessages = { last: null, count: 0 }
  }

  /**
   * Handles joins, leaves and replacements of chat rooms and can cache the user's last_message if needed.
   */
  public async manageChatRoom(
    { access_type, room_id, last_message }: ManageChatRoomEventDto, 
    callback: SocketCallback
  ) {
    logger.debug("socket manageChatRoom:", { access_type, room_id, last_message });

    try {
      const user = this.socket.userDecodedClaims!;

      if (typeof room_id === "object" && ["global", "private"].includes(access_type)) {
        if (Object.values(room_id).length) {
          const roomId = room_id.join || "";

          if (access_type === "global") {
            const globalRoomId = chatRoomsUtils.getGlobalChatRoomId(roomId);
            room_id = { ...room_id, join: globalRoomId };
          } else {
            room_id = { ...room_id, join: getFriendRoom(user.member_id, roomId) };
          }
        }
      } else {
        throw new SocketError(GENERAL_BAD_REQUEST_MESSAGE, "bad request");
      }

      // On a leave, the last_message comes from private chat rooms to be attached to friends if defined.
      if (last_message && access_type === "private" && "message" in last_message)
        await this.cacheChatMessage(last_message, true);

      const entries = Object.entries(room_id),
        isReplace = entries.length === 2; // When entries.length === 2 it replaces the room else join or leave.

      let chat_messages: Omit<ChatMessage, "_id">[] = [],
        status = "";

      for (let i = 0; i < entries.length; i++) {
        const [action, id] = entries[i];

        if (entries.length > 2 || !MANAGE_CHAT_ROOM_ACTIONS.includes(action as any)) 
          throw new SocketError("Access Denied", "forbidden");
        else if (!chatRoomsUtils.isRoomId(id || "")) throw new SocketError("Access Denied", "forbidden");

        // Join or leaves the room.
        this.socket[action as typeof MANAGE_CHAT_ROOM_ACTIONS[number]](id);
        status = action === "join" || (isReplace && i === 1) ? "joined" : "left";

        // Sends join and leave info messages only for private rooms.
        if (!chatRoomsUtils.isRoomId(id, "global"))
          this.socket.in(id).emit(ChatEvent.CHAT_MESSAGE_SENT, {
            message: `${user.username} has ${status} the chat.`,
          });

        if (status === "joined") 
          chat_messages = await getChatMessages(room_id.join!, user.sub);
      }

      return callback({
        status: "ok",
        message: entries.length ? `You ${status} the chat.` : "No join or leave was requested.",
        ...((status === "joined") && {
          chat_id: room_id.join,
          chat_messages
        })
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "manageChatRoom service error.");
    }
  }

  /**
   * Notifies the friend when the user starts or stops typing in private chat rooms.
   */
  public async typing({ friend_member_id, is_typing }: TypingEventDto, callback: SocketCallback) {
    logger.debug("socket typing", { friend_member_id, is_typing });
  
    try {
      this.socket
        .to(getFriendRoom(this.socket.userDecodedClaims!.member_id, friend_member_id))
        .emit(ChatEvent.FRIEND_TYPING_ACTIVITY, { is_typing });

      callback({
        status: "ok",
        message: "Successfully sent the typing status to the chat room.",
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "typing service error.");
    }
  }

  /**
   * Handles the messages of a chat room; stores the message and sends it back.
   */
  public async chatMessage(data: ChatMessageEventDto & { created_at: Date; }, callback: SocketCallback) {
    logger.debug("socket chatMessage", data);
    const { room_id, message } = data;

    try {
      if (!chatRoomsUtils.isRoomId(room_id)) throw new SocketError("Access Denied", "forbidden");

      data.created_at = new Date();

      // TODO: Make handling dups better, like if the message is similar and if they send the same message again after they send a normal message.
      // TODO: Also, should have it per username or something (or do it on the client).
      if (message === this.duplicateMessages.last) this.duplicateMessages.count++;

      if (this.duplicateMessages.count) {
        if (this.duplicateMessages.last !== message) {
          this.duplicateMessages.count = 0;
          await this.cacheChatMessage(data);
        }
        if (this.duplicateMessages.count >= 3)
          return callback({ status: "bad request", ERROR: "Duplicate messages count exceed max." })
      } else {
        await this.cacheChatMessage(data);
      }

      this.io.in(room_id).emit(ChatEvent.CHAT_MESSAGE_SENT, {
        ...data,
        created_at: data.created_at.toISOString()
      });
      this.duplicateMessages.last = message;

      callback({ status: "ok", message: "Successfully broadcasted chat message to specified room." });
    } catch (error: any) {
      return handleSocketError(callback, error, "chatMessage service error.");
    }
  }

  /**
   * Handles socket instance disconnection; Stores the user's private messages to the database if needed.
   */
  public async disconnect() {
    logger.debug(`Chat socket instance disconnected; ${this.socket.id}.`);

    try {
      const user = this.socket.userDecodedClaims!,
        userFriends = await getUserFriends(user.sub, { lean: true });

      const promises: Promise<void>[] = [];
      for (const friend of userFriends.list.values()) {
        promises.push(
          archiveChatMessageQueue(getFriendRoom(user.member_id, friend.member_id))
        );
      }
      await Promise.all(promises);
    } catch (error: any) {
      logger.error("chat/disconnect service error:\n", error.message);
    }
  }

  /**
   * Caches the user's resent chat message to a 'queue' and caches their last chat message separately if needed.
   */
  private async cacheChatMessage(chatMessage: Omit<ChatMessage, "_id"> | LastChatMessageDto, isLast?: boolean) {
    try {
      if (isLast) {
        // TODO: If the last message sent in a private chat was 3 days ago, save it anyways? If there is no message just cache? (prob should use db for totally inactive users (don't save if they're totally inactive...)).
        await redisClient.set(`chat:${chatMessage.room_id}:last_message`, chatMessage.message);
      } else {
        await archiveChatMessageQueue(chatMessage.room_id, this.socket.userDecodedClaims!.sub);
        // Message cache.
        await redisClient.lPush(`chat:${chatMessage.room_id}:message_queue`, JSON.stringify(chatMessage));
      }
    } catch (error: any) {
      logger.error("cacheChatMessage service error:\n", error.message);
      throw error;
    }
  }
}
