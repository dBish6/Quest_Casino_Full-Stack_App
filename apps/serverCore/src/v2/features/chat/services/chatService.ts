/**
 * Chat Service
 *
 * Description:
 * Handles functionalities for managing messages in global and private chat rooms that can be for HTTP or Sockets.
 */

import type { Model, ObjectId } from "mongoose";
import type { ChatRoomId, GlobalChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import type { GlobalChatMessageDoc, PrivateChatMessageDoc, ChatMessage } from "@chatFeat/typings/ChatMessage";
import type ChatMessageEventDto from "@qc/typescript/dtos/ChatMessageEventDto";

import MAX_MESSAGES_COUNT from "@chatFeat/constants/MAX_MESSAGES_COUNT";

import { handleApiError, ApiError, SocketError } from "@utils/handleError";
import chatRoomUtils from "@chatFeat/utils/ChatRoomsUtils";

import { GlobalChatMessage, PrivateChatMessage } from "@chatFeat/models";
import { redisClient } from "@cache";
import Lock from "@utils/DistributedLock";
import { logger } from "@qc/utils";

/**
 * ...
 */
export async function archiveChatMessageQueue(roomId: ChatRoomId) {
  const lock = new Lock("archive_messages");

  try {
    // Lock because this can happen at the same time for multiple connections since this is used in chat messaging.
    lock.withLock(async () => {
      const recentMessages = await redisClient.lRange(`chat:${roomId}:message_queue`, 0, -1);
      logger.debug("Cached recent messages", recentMessages);
      
      if (
        chatRoomUtils.isRoom(roomId, "global") &&
        recentMessages.length >= MAX_MESSAGES_COUNT.global.cached
      ) {
        logger.debug("Global; Inserting cached chat messages to DB.")
        await GlobalChatMessage(roomId as GlobalChatRoomId).insertMany(recentMessages.map(msg => JSON.parse(msg)));

        await redisClient.lTrim(`chat:${roomId}:message_queue`, -1, 0); // Clears the cache.
      } else if (
        chatRoomUtils.isRoom(roomId, "private") &&
        recentMessages.length >= MAX_MESSAGES_COUNT.private.cached
      ) {
        logger.debug("Private; Inserting cached chat messages to DB.")
        // TODO:
        await PrivateChatMessage.updateMany(
          { room_id: roomId },
          { $push: { chats: { $each: recentMessages } } }
        )

        await redisClient.lTrim(`chat:${roomId}:message_queue`, -1, 0);
      }
    })
  } catch (error: any) {
    throw handleApiError(error, "archiveChatMessageQueue service error.");
  }
}

export async function cacheChatMessage(chatMessage: ChatMessageEventDto) {
  try {
    await archiveChatMessageQueue(chatMessage.room_id);
    
    await redisClient.lPush(`chat:${chatMessage.room_id}:message_queue`, JSON.stringify(chatMessage));
  } catch (error: any) {
    throw handleApiError(error, "cacheChatMessage service error.");
  }
}

/**
 * ...
 */
export async function getChatMessages(roomId: ChatRoomId, userId?: ObjectId | string): Promise<Omit<ChatMessage, "_id">[]> {
  try {
    let archivedMessages: Omit<ChatMessage, "_id">[];

    if (chatRoomUtils.isRoom(roomId, "global")) {
      archivedMessages = await GlobalChatMessage(roomId as GlobalChatRoomId)
        .find({ room_id: roomId })
        .select("-_id")
        .lean();
    } else if (chatRoomUtils.isRoom(roomId, "private")) {
      if (!userId) return [];

      // TODO:
      const privateUserDoc = 
        await PrivateChatMessage.findById(userId).select("-_id -created_at -updated_at").lean();
      if (!privateUserDoc) 
        throw new SocketError(
          "Unexpectedly the user's private messages was not found.", "not found"
        );

      archivedMessages = privateUserDoc.chats;
    } else {
      throw new SocketError("Access Denied; Invalid credentials.", "forbidden");
    }

    const recentMessages = await redisClient.lRange(`chat:${roomId}:message_queue`, 0, -1);
    console.log("recentMessages", recentMessages);
    console.log("archivedMessages", archivedMessages);

    return [
      ...recentMessages.map(msg => JSON.parse(msg)),
      ...archivedMessages
    ];
  } catch (error: any) {
    throw handleApiError(error, "getChatMessages service error.");
  }
}
