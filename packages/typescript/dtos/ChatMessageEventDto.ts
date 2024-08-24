import { ChatRoomId } from "../typings/ChatRoomIds";

export default interface ChatMessageEventDto {
  room_id: ChatRoomId;
  avatar_url?: string;
  username: string;
  message: string;
  created_at: string;
}
