import type { CallbackWithoutResultAndOptionalError } from "mongoose";
import type { MessagePrivateDoc } from "@chatFeat/typings/Message";

import { handleApiError } from "@utils/handleError";

import { messagePrivateSchema } from "./schemas/messageSchema";
import { MessagePrivate } from ".";

async function handleMaxPrivateMessages(next: CallbackWithoutResultAndOptionalError) {
  const maxMessages = 40,
    // @ts-ignore
    username = (this as MessagePrivateDoc).username;

  try {
    const messageCount = await MessagePrivate.countDocuments({ username });

    if (messageCount >= maxMessages) {
      const oldestMessage = await MessagePrivate.findOne({ username }).sort({ created_at: 1 });
      if (oldestMessage) await oldestMessage.deleteOne();
    }

    next();
  } catch (error) {
    next(handleApiError(error, "handleMaxPrivateMessages mongoose middleware error.", 500));
  }
}

messagePrivateSchema.pre("save", handleMaxPrivateMessages);
