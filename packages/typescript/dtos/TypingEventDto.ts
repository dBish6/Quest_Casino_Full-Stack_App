import { ChatRoomId } from "../typings/ChatRoomIds";

export default interface TypingEventDto {
  room_id: ChatRoomId;
  is_typing: boolean;
}
