import { GlobalChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import { SocketResponse } from "@typings/ApiResponse";
import ChatMessage from "@chatFeat/typings/ChatMessage";

export default interface ManageChatRoomCallbackDto extends SocketResponse {
  global_chat_id?: GlobalChatRoomId;
  chat_messages?: ChatMessage[];
}
