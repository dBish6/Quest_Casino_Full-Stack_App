/**
 * HTTP Chat Service
 *
 * Description:
 * Handles HTTP-related functionalities for managing messages in global and private chat rooms.
 */

import type { Rooms, PublicRooms } from "@chatFeat/typings/Rooms";
import type { MessageDoc } from "@chatFeat/typings/Message";
import type MessageDto from "@chatFeat/dtos/MessageDto";

import { handleApiError } from "@utils/handleError";
import continentUtils from "@chatFeat/utils/ContinentUtils";

import { MessageGlobal, MessagePrivate } from "@chatFeat/models";
import { Model } from "mongoose";

function getMessageModel(roomId: Rooms) {
  return (
    continentUtils.isContinent(roomId)
      ? MessageGlobal(roomId as PublicRooms)
      : MessagePrivate
  ) as Model<MessageDoc>;
}

export async function getMessages(roomId: Rooms) {
  try {
    const MessageModel = getMessageModel(roomId);
    return await MessageModel.find().sort({ created_at: -1 });
  } catch (error: any) {
    throw handleApiError(error, "getMessages service error.", 500);
  }
}

export async function addMessage(message: MessageDto) {
  try {
    const MessageModel = getMessageModel(message.room_id);
    return await new MessageModel(message).save();
  } catch (error: any) {
    throw handleApiError(error, "addMessage service error.", 500);
  }
}
