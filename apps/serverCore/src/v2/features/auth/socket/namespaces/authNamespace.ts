import type { Socket, Namespace } from "socket.io";
import SocketAuthService from "@authFeatSocket/services/SocketAuthService";

const authNamespace = (socket: Socket, io: Namespace) => {
  const service = new SocketAuthService(socket, io);

  // socket.on("update_activity", (data: boolean, callback: SocketCallback) =>
  // );

  socket.on("manage_friends", service.manageFriends);
};

export default authNamespace;
