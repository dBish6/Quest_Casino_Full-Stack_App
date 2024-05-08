import type { Socket, Namespace } from "socket.io";
import SocketCallback from "@typings/SocketCallback";

const authNamespace = (socket: Socket, io: Namespace) => {
  // socket.on("update_activity", (data: boolean, callback: SocketCallback) =>
  // );
  //   socket.on("disconnect", () => service.disconnect());
};

export default authNamespace;
