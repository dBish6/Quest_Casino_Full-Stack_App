import ChatRoomAccessType from "../typings/ChatRoomAccessType";
import { ChatRoomId } from "../typings/ChatRoomIds";
import { LastChatMessageDto } from "./ChatMessageEventDto";

export default interface ManageChatRoomEventDto {
  access_type: ChatRoomAccessType;
  room_id: { join?: ChatRoomId; leave?: ChatRoomId };
  last_message?: LastChatMessageDto;
}
