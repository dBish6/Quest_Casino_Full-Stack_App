/**
 * Socket.io Entry File
 *
 * Description:
 * Setup for the server's websocket connection and namespaces.
 */

import { CorsOptions } from "cors";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

import chatNamespace from "@chatFeat/namespaces/chatNamespace";

export let io: SocketServer;

export default function initializeSocketIo(
  httpServer: HttpServer,
  corsOptions?: CorsOptions
) {
  io = new SocketServer(httpServer, {
    cors: corsOptions,
  });

  // *Namespaces*
  io.of("/auth").on("connection", (socket) => {
    console.log(`Auth namespace connected; ${socket.id}.`);

    chatNamespace(socket, io.of("/auth"));
  });

  io.of("/chat").on("connection", (socket) => {
    console.log(`Chat namespace connected; ${socket.id}.`);

    chatNamespace(socket, io.of("/chat"));
  });
}
