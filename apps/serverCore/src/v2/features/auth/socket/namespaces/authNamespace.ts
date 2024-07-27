import type { Socket, Namespace } from "socket.io";
import { AuthEvent } from "@qc/constants";
import SocketAuthService from "@authFeatSocket/services/SocketAuthService";

const authNamespace = (socket: Socket, io: Namespace) => {
  const service = new SocketAuthService(socket, io);

  // socket.on("update_activity", (data: boolean, callback: SocketCallback) =>
  // );

  socket.on(AuthEvent.INITIALIZE_FRIENDS, service.initializeFriends.bind(service));

  socket.on(AuthEvent.MANAGE_FRIEND_ROOM, service.manageFriendRoom.bind(service));

  socket.on(AuthEvent.MANAGE_FRIEND_REQUEST, service.manageFriendRequest.bind(service));

  // socket.on("disconnect", service.disconnect);
};

export default authNamespace;
