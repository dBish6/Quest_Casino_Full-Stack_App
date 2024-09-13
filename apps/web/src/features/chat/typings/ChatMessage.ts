import { ChatRoomId } from "@qc/typescript/typings/ChatRoomIds";

export default interface ChatMessage {
  room_id: ChatRoomId;
  avatar_url?: string;
  username: string;
  message: string;
  created_at: string;
}
