import type { CallbackWithoutResultAndOptionalError, Model } from "mongoose";
import type { PrivateChatMessageDoc } from "@chatFeat/typings/ChatMessage";

import MAX_MESSAGES_COUNT from "@chatFeat/constants/MAX_MESSAGES_COUNT";

import { handleApiError } from "@utils/handleError";
import { logger } from "@qc/utils";

import { globalChatMessageSchema, privateChatMessageSchema, GlobalChatMessage } from "./schemas/chatMessageSchema";

/**
 * Deletes the oldest global chats messages from the database to maintain the max limit.
 * @middleware Mongoose
 */
async function handleMaxGlobalChatMessages(next: CallbackWithoutResultAndOptionalError) {
  try {
    const maxMessages = MAX_MESSAGES_COUNT.global.stored,
      GlobalChatMessageModel = GlobalChatMessage(this.collection.name.split("_global_")[1]);

    const messageCount = await GlobalChatMessageModel.countDocuments();
    if (messageCount > maxMessages) {
      const oldMessages = await GlobalChatMessageModel.find()
        .sort({ created_at: 1 })
        .limit(messageCount - maxMessages)
        .select("_id")
        .lean();

      await GlobalChatMessageModel.deleteMany({
        _id: { $in: oldMessages.map((message) => message._id) }
      });

      logger.info(`Cleanup of chat messages on collection ${GlobalChatMessageModel.collection.name} completed.`);
    }
    next();
  } catch (error: any) {
    next(handleApiError(error, "handleMaxGlobalChatMessages mongoose middleware error."));
  }
}
globalChatMessageSchema.pre("insertMany", handleMaxGlobalChatMessages);
globalChatMessageSchema.pre("save", handleMaxGlobalChatMessages);

/**
 * Deletes the oldest private chats messages from the database to maintain the max limit.
 * @middleware Mongoose
 */
async function handleMaxPrivateChatMessages(next: CallbackWithoutResultAndOptionalError) {
  try {
    const maxMessages = MAX_MESSAGES_COUNT.private.stored,
      PrivateChatMessage = this.model as Model<PrivateChatMessageDoc>;

    const result = await PrivateChatMessage.aggregate([
      { $match: { room_id: this.getQuery().room_id } },
      {
        $set: {
          chats: {
            // If there is 75 messages and maxMessages is 50, it keeps the newest 50 messages and removes the oldest 25.
            $slice: ["$chats", -maxMessages] // We use $push so always sorted oldest to newest.
          }
        }
      },
      { $project: { chats: 1 } }
    ]);
    
    if (result.length > 0) {
      await PrivateChatMessage.updateOne(
        { room_id: this.getQuery().room_id },
        { $set: { chats: result[0].chats.reverse() } }
      );
    }

    logger.info(`Cleanup of chat messages on collection ${PrivateChatMessage.collection.name} completed.`);
    next();
  } catch (error: any) {
    next(handleApiError(error, "handleMaxPrivateChatMessages mongoose middleware error."));
  }
}
privateChatMessageSchema.pre("updateOne", handleMaxPrivateChatMessages);
privateChatMessageSchema.pre("findOneAndUpdate", handleMaxPrivateChatMessages);
