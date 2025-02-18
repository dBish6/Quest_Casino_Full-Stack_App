/**
 * Socket.io Entry File
 *
 * Description:
 * Setup for the server's websocket connection and namespaces.
 */

import type { CorsOptions } from "cors";
import type { Server as HttpServer } from "http";

import { Server as SocketServer } from "socket.io";
import cookieParser from "cookie-parser";

import { logger } from "@qc/utils";

import { redisClient } from "@cache";

import verifyUserToken from "@authFeat/middleware/tokens/verifyUserToken";
import userVerificationRequired from "@authFeat/middleware/userVerificationRequired";

import authNamespace from "@authFeatSocket/namespaces/authNamespace";
import chatNamespace from "@chatFeatSocket/namespaces/chatNamespace";
import gameNamespace from "@gameFeatSocket/namespaces/gameNamespace";

const baseUrl = "/api/v2/socket",
  namespaces = [`${baseUrl}/auth`, `${baseUrl}/chat`, `${baseUrl}/game`];

export default function initializeSocketIo(
  httpServer: HttpServer,
  corsOptions?: CorsOptions
) {
  const io = new SocketServer(httpServer, {
    cors: corsOptions
  });

  // *Middleware*
  io.engine.use(cookieParser());

  namespaces.forEach((nsp) => {
    io.of(nsp).use((socket, next) => verifyUserToken(socket, null, next));
    io.of(nsp).use((socket, next) => userVerificationRequired(socket, null, next));
  });

  // *Namespaces*
  io.of(`${baseUrl}/auth`).on("connection", (socket) => {
    // Caches their auth socket ID for getting a certain socket, sending events directly with the socket ID and to know what
    // user's are currently connected, etc.
    redisClient.set(`user:${socket.userDecodedClaims!.member_id}:socket_id`, socket.id).then(() => {
        logger.debug(`Client connected to auth namespace; ${socket.id}`);
        authNamespace(socket, io.of(`${baseUrl}/auth`));
      });
  });

  io.of(`${baseUrl}/chat`).on("connection", (socket) => {
    logger.debug(`Client connected to chat namespace; ${socket.id}.`);

    chatNamespace(socket, io.of(`${baseUrl}/chat`));
  });

  io.of(`${baseUrl}/game`).on("connection", (socket) => {
    logger.debug(`Client connected to game namespace; ${socket.id}.`);

    gameNamespace(socket, io.of(`${baseUrl}/game`));
  });
}
