import { ChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import { SocketResponse } from "@typings/ApiResponse";
import ChatMessage from "@chatFeat/typings/ChatMessage";

export default interface ManageChatRoomCallbackDto extends SocketResponse {
  chat_id?: ChatRoomId;
  chat_messages?: ChatMessage[];
}
