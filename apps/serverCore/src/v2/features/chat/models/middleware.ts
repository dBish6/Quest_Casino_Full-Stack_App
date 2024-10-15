import type { CallbackWithoutResultAndOptionalError, Model } from "mongoose";
import { GlobalChatMessageDoc, PrivateChatMessageDoc } from "@chatFeat/typings/ChatMessage";

import MAX_MESSAGES_COUNT from "@chatFeat/constants/MAX_MESSAGES_COUNT";

import { handleApiError } from "@utils/handleError";

import { globalChatMessageSchema, privateChatMessageSchema } from "./schemas/chatMessageSchema";

/**
 * Deletes the oldest global chats messages from the database to maintain the max limit.
 * @middleware Mongoose
 */
async function handleMaxGlobalMessages(next: CallbackWithoutResultAndOptionalError) {
  try {
    const maxMessages = MAX_MESSAGES_COUNT.global.stored,
      PrivateChatMessage = this.model as Model<GlobalChatMessageDoc>;

    const messageCount = await PrivateChatMessage.countDocuments({ room_id: this.room_id });
    if (messageCount > maxMessages) 
      await PrivateChatMessage.deleteMany({ room_id: this.room_id })
        .sort({ "chats.created_at": 1 })
        .limit(messageCount - maxMessages);
    
    next();
  } catch (error: any) {
    next(handleApiError(error, "handleMaxGlobalMessages mongoose middleware error."));
  }
}

globalChatMessageSchema.pre("insertMany", handleMaxGlobalMessages);
globalChatMessageSchema.pre("save", handleMaxGlobalMessages);

// TODO: Private
