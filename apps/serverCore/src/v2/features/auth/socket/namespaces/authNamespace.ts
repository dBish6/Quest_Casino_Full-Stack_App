import type { Socket, Namespace } from "socket.io";
import { AuthEvent } from "@qc/constants";
import SocketAuthService from "@authFeatSocket/services/SocketAuthService";

let service: SocketAuthService;
const authNamespace = (socket: Socket, io: Namespace) => {
  service = new SocketAuthService(socket, io);

  socket.on(AuthEvent.INITIALIZE_FRIENDS, service.initializeFriends.bind(service));
  socket.on(AuthEvent.MANAGE_FRIEND_REQUEST, service.manageFriendRequest.bind(service));
  socket.on(AuthEvent.UNFRIEND, service.unfriend.bind(service));

  socket.on(AuthEvent.USER_ACTIVITY, service.userActivity.bind(service));

  socket.on("disconnect", service.disconnect.bind(service));
};

export default authNamespace;
export const getSocketAuthService = () => service;
