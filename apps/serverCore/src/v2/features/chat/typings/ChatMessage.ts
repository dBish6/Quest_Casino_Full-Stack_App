import type { Document, ObjectId } from "mongoose";
import type ChatMessageEventDto from "@qc/typescript/dtos/ChatMessageEventDto";
import type { GlobalChatRoomId, PrivateChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import type DefaultDocFields from "@typings/DefaultDocFields";

/**
 * All fields within a message document.
 */
export interface ChatMessage extends Omit<ChatMessageEventDto, "created_at"> {
  _id: ObjectId;
  created_at: Date;
}

// export interface ChatMessageDoc extends Document, ChatMessage {
//   _id: ObjectId;
// }

export interface GlobalChatMessageDoc extends Document, ChatMessage {
  _id: ObjectId;
  room_id: GlobalChatRoomId;
}

export interface PrivateChatMessageDoc extends Document, DefaultDocFields {
  _id: ObjectId;
  chats: Omit<ChatMessage, "_id" | "updated_at">[] & { room_id: PrivateChatRoomId };
}

// export interface PrivateChatMessageDoc extends ChatMessageDoc {
//   room_id: PrivateChatRoomId;
// }

export type ChatMessageDoc = GlobalChatMessageDoc | PrivateChatMessageDoc;