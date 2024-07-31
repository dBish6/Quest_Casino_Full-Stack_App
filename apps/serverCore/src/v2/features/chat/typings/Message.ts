import type { Document, ObjectId } from "mongoose";
import type MessageDto from "@chatFeat/dtos/MessageDto";
import type DefaultDocFields from "@typings/DefaultDocFields";
import type { PublicRooms, PrivateRooms } from "@chatFeat/typings/Rooms";

/**
 * All fields within a message document.
 */
export interface Message extends MessageDto, DefaultDocFields {
  _id: ObjectId;
}

export interface MessageDoc extends Document, Message {
  _id: ObjectId;
}

export interface MessageGlobalDoc extends MessageDoc {
  room_id: PublicRooms;
}

export interface MessagePrivateDoc extends MessageDoc {
  room_id: PrivateRooms;
}