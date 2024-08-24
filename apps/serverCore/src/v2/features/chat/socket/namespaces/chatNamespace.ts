import type { Socket, Namespace } from "socket.io";
import { ChatEvent } from "@qc/constants";
import SocketChatService from "@chatFeatSocket/services/SocketChatService";

function chatNamespace(socket: Socket, io: Namespace) {
  const service = new SocketChatService(socket, io);

  socket.on(ChatEvent.MANAGE_CHAT_ROOM, service.manageChatRoom.bind(service));

  socket.on(ChatEvent.TYPING, service.typing.bind(service));

  socket.on(ChatEvent.CHAT_MESSAGE, service.chatMessage.bind(service));

  socket.on("disconnect", service.disconnect.bind(service));
}

export default chatNamespace;
