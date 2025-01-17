import type { Socket, Namespace } from "socket.io";
import { GameEvent } from "@qc/constants";
import SocketGameService from "@gameFeatSocket/services/SocketGameService";

const authNamespace = (socket: Socket, io: Namespace) => {
  const service = new SocketGameService(socket, io);

  socket.on(GameEvent.MANAGE_RECORD, service.manageRecord.bind(service));
  socket.on(GameEvent.MANAGE_PROGRESS, service.manageProgress.bind(service));
};

export default authNamespace;
