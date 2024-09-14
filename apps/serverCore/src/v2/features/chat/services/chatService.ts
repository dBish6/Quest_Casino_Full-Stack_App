/**
 * Chat Service
 *
 * Description:
 * Handles functionalities for managing messages in global and private chat rooms that can be for HTTP or Sockets.
 */

import type { ObjectId } from "mongoose";
import type { ChatRoomId, GlobalChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import type { ChatMessage } from "@chatFeat/typings/ChatMessage";

import MAX_MESSAGES_COUNT from "@chatFeat/constants/MAX_MESSAGES_COUNT";

import { logger } from "@qc/utils"
import { handleApiError, ApiError, SocketError } from "@utils/handleError";
import Lock from "@utils/DistributedLock";
import chatRoomUtils from "@chatFeat/utils/ChatRoomsUtils";

import { GlobalChatMessage, PrivateChatMessage } from "@chatFeat/models";
import { redisClient } from "@cache";

/**
 * ...
 */
export async function archiveChatMessageQueue(roomId: ChatRoomId, userId?: ObjectId | string) {
  const lock = new Lock("archive_messages");

  try {
    // Lock because this can happen at the same time for multiple connections since this is used in chat messaging.
    lock.withLock(async () => {
      const recentMessages = await redisClient.lRange(`chat:${roomId}:message_queue`, 0, -1);
      logger.debug("Cached recent messages", recentMessages);
      
      if (
        chatRoomUtils.isRoomId(roomId, "global") &&
        recentMessages.length >= MAX_MESSAGES_COUNT.global.cached
      ) {
        logger.debug("Global; Inserting cached chat messages to DB.")
        await GlobalChatMessage(roomId as GlobalChatRoomId).insertMany(recentMessages.map((msg) => JSON.parse(msg)));

        await redisClient.lTrim(`chat:${roomId}:message_queue`, -1, 0); // Clears the cache.
      } else if (
        chatRoomUtils.isRoomId(roomId, "private") &&
        recentMessages.length >= MAX_MESSAGES_COUNT.private.cached
      ) {
        logger.debug("Private; Inserting cached chat messages to DB.")
        if (!userId) 
          throw new ApiError("userId is required when archiving cached private chat messages to the DB.");

        // TODO:
        await PrivateChatMessage.bulkWrite(
          recentMessages.map((msg) => ({
            updateOne: {
              filter: { _id: userId, "chats.room_id": roomId },
              update: { $push: { chats: JSON.parse(msg) } },
            },
          }))
        );

        await redisClient.lTrim(`chat:${roomId}:message_queue`, -1, 0);
      }
    })
  } catch (error: any) {
    throw handleApiError(error, "archiveChatMessageQueue service error.");
  }
}

/**
 * ...
 */
export async function getChatMessages(roomId: ChatRoomId, userId?: ObjectId | string): Promise<Omit<ChatMessage, "_id">[]> {
  try {
    let archivedMessages: Omit<ChatMessage, "_id">[];

    if (chatRoomUtils.isRoomId(roomId, "global")) {
      archivedMessages = await GlobalChatMessage(roomId as GlobalChatRoomId)
        .find({ room_id: roomId })
        .select("-_id")
        .lean();
    } else if (chatRoomUtils.isRoomId(roomId, "private")) {
      if (!userId) return [];

      // TODO:
      const privateUserDocs = await PrivateChatMessage.aggregate([
        { $match: { _id: userId } },
        { $unwind: "$chats" },

        { $match: { "chats.room_id": roomId } },
        { $sort: { "chats.created_at": -1 } },

        { $group: { _id: 0, chats: { $push: "$chats" } } }
      ]);
      console.log("privateUserDocs", privateUserDocs);

      archivedMessages = []
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
