/**
 * Socket.io Entry File
 *
 * Description:
 * Setup for the server's websocket connection and namespaces.
 */

import { CorsOptions } from "cors";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { logger } from "@qc/utils";

import verifyUserToken from "@authFeatSocket/middleware/verifyUserToken";

import authNamespace from "@authFeatSocket/namespaces/authNamespace";
import chatNamespace from "@chatFeatSocket/namespaces/chatNamespace";

const baseUrl = "/socket/v2";

export default function initializeSocketIo(
  httpServer: HttpServer,
  corsOptions?: CorsOptions
) {
  const io = new SocketServer(httpServer, {
    cors: corsOptions,
  });

  io.engine.use(verifyUserToken);

  // *Namespaces*
  io.of(`${baseUrl}/auth`).on("connection", (socket) => {
    logger.debug(`Client connected to auth namespace; ${socket.id}`);

    authNamespace(socket, io.of("/auth"));
  });

  io.of(`${baseUrl}/chat`).on("connection", (socket) => {
    logger.debug(`Client connected to chat namespace; ${socket.id}.`);

    chatNamespace(socket, io.of("/chat"));
  });
}
