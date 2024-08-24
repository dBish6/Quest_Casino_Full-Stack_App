import { ChatRoomId } from "../typings/ChatRoomIds";

export default interface ManageChatRoomEventDto {
  room_id: ChatRoomId | null;
  action_type: "join" | "leave";
  country?: string;
}
