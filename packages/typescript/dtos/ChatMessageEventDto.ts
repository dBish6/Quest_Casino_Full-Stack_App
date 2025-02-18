import { ChatRoomId } from "../typings/ChatRoomIds";

/** New chat message coming in. */
export default interface ChatMessageEventDto {
  room_id: ChatRoomId;
  avatar_url?: string;
  username: string;
  message: string;
}

/**
 * A user's very last message in a chat room to be sent.
 */
export type LastChatMessageDto =
  | (ChatMessageEventDto & { created_at: string })
  | { room_id: string; message: "" };
