/**
 * Socket Chat Service
 *
 * Description:
 * Handles real-time chat functionalities including managing rooms, user typing status, and global and private messaging.
 */

import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
// import type { ChatRoomId, GlobalChatRoomId, PrivateChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import type { ChatMessage } from "@chatFeat/typings/ChatMessage";

import type ManageChatRoomEventDto  from "@qc/typescript/dtos/ManageChatRoomEventDto";
import type TypingEventDto from "@qc/typescript/dtos/TypingEventDto";
import type ChatMessageEventDto from "@qc/typescript/dtos/ChatMessageEventDto";

import { ChatEvent } from "@qc/constants";

import { logger } from "@qc/utils";
import { handleSocketError, SocketError } from "@utils/handleError";
import chatRoomsUtils from "@chatFeat/utils/ChatRoomsUtils";
import getFriendRoom from "@authFeatSocket/utils/getFriendRoom";

import { getChatMessages, cacheChatMessage, archiveChatMessageQueue } from "@chatFeat/services/chatService";
import { getUserFriends } from "@authFeat/services/authService";
// import { redisClient } from "@cache";

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
   * Handles joins and leaves of chat rooms.
   */
  async manageChatRoom({ room_id, action_type, country }: ManageChatRoomEventDto, callback: SocketCallback) {
    logger.debug("socket manageChatRoom:", { room_id, action_type, country });

    if (!["join", "leave"].includes(action_type))
      throw new SocketError(
        "There was no data provided or the action_type is invalid",
        "bad request"
      );

    try {
      if (room_id === null && action_type === "join" && country) {
        const globalRoomId = chatRoomsUtils.getGlobalChatRoom(country);
        room_id = globalRoomId;
      } else if (!chatRoomsUtils.isRoom(room_id)) {
        throw new SocketError("Access Denied", "forbidden");
      }
      const user = this.socket.decodedClaims!;

      this.socket[action_type](room_id!);
      const status = action_type === "join" ? "joined" : "left";

      if (chatRoomsUtils.isRoom(room_id, "private"))
        this.socket.in(room_id!).emit("get_chat_message", {
          message: `${user.username} has ${status} the chat.`,
        });

      let chat_messages: Omit<ChatMessage, "_id">[] = [];
      if (action_type === "join") chat_messages = await getChatMessages(room_id!, user.sub);

      return callback({ 
        status: "ok", 
        message: `You ${status} the chat.`,
        ...(action_type === "join" && {
          ...(country && { global_chat_id: room_id }),
          chat_messages
        })
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "manageChatRoom service error.");
    }
  }

  /**
   * Notifies when a user starts or stops typing in a chat room.
   */
  typing({ room_id, is_typing }: TypingEventDto, callback: SocketCallback) {
    logger.debug("socket manageTyping", { room_id, is_typing });

    try {
      if (!chatRoomsUtils.isRoom(room_id)) throw new SocketError("Access Denied", "forbidden");

      this.socket.in(room_id).emit("typing_activity", {
        verification_token: this.socket.decodedClaims!.verification_token,
        is_typing
      });

      callback({
        status: "ok",
        message: "Successfully sent the typing status to chat room.",
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "manageTyping service error.");
    }
  }

  /**
   * Handles the messages of a chat room; stores the message and sends it back.
   */
  async chatMessage(data: ChatMessageEventDto, callback: SocketCallback) {
    logger.debug("socket chatMessage", data);
    const { room_id, message, ...rest } = data;

    try {
      if (!chatRoomsUtils.isRoom(room_id)) throw new SocketError("Access Denied", "forbidden");

      data.created_at = new Date(data.created_at) as any;

      // TODO: Make handling dups better, like if the message is similar and if they send the same message again after they send a normal message.
      if (message === this.duplicateMessages.last) this.duplicateMessages.count++;

      if (this.duplicateMessages.count) {
        // { "message sequence": 0 }?
        if (this.duplicateMessages.last !== message) {
          this.duplicateMessages.count = 0;
          await cacheChatMessage(data);
        }
        if (this.duplicateMessages.count === 3)
          return callback({ status: "bad request", ERROR: "Duplicate messages count exceed max." })
      } else {
        await cacheChatMessage(data);
      }

      this.io.in(room_id).emit(ChatEvent.CHAT_MESSAGE_SENT, {
        ...rest,
        message,
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
  async disconnect() {
    logger.debug(`Chat socket instance disconnected; ${this.socket.id}.`);

    try {
      const user = this.socket.decodedClaims!,
        userFriends = await getUserFriends(user.sub);

      const promises: Promise<void>[] = [];
      for (const friend of userFriends.list.values()) {
        promises.push(
          archiveChatMessageQueue(getFriendRoom(user.verification_token, friend.verification_token))
        );
      }
      await Promise.all(promises);
    } catch (error: any) {
      logger.error("chat/disconnect service error:\n", error.message);
    }
  }
}
