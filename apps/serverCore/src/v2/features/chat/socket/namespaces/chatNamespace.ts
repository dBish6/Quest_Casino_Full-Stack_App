import type { Socket, Namespace } from "socket.io";

import SocketChatService from "@chatFeatSocket/services/SocketChatService";

function chatNamespace(socket: Socket, io: Namespace) {
  const service = new SocketChatService(socket, io);

  socket.on("manage_room", service.manageRoom);

  socket.on("typing", service.typing);

  socket.on("chat_message", service.chatMessage);
}

export default chatNamespace;
