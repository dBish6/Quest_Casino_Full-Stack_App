import type { Document, ObjectId } from "mongoose";
import type ChatMessageEventDto from "@qc/typescript/dtos/ChatMessageEventDto";
import type { GlobalChatRoomId, PrivateChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import type DefaultDocFields from "@typings/DefaultDocFields";

/**
 * All fields within a message document.
 */
export interface ChatMessage extends ChatMessageEventDto {
  created_at: Date;
}

export interface GlobalChatMessageDoc extends Document, ChatMessage {
  _id: ObjectId;
  room_id: GlobalChatRoomId;
}

export interface PrivateChatMessageDoc extends Document, DefaultDocFields {
  _id: ObjectId;
  room_id: string;
  chats: (ChatMessage & { room_id: PrivateChatRoomId })[];
  updated_at: Date;
}

export type ChatMessageDoc = GlobalChatMessageDoc | PrivateChatMessageDoc;