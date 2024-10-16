/**
 * Socket.io Entry File
 *
 * Description:
 * Setup for the server's websocket connection and namespaces.
 */

import { CorsOptions } from "cors";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import cookieParser from "cookie-parser";

import { logger } from "@qc/utils";

import { redisClient } from "@cache";

import verifyUserToken from "@authFeatSocket/middleware/verifyUserToken";
import isUserVerified from "@authFeat/socket/middleware/isUserVerified";

import authNamespace from "@authFeatSocket/namespaces/authNamespace";
import chatNamespace from "@chatFeatSocket/namespaces/chatNamespace";

const baseUrl = "/api/v2/socket",
  namespaces = [`${baseUrl}/auth`, `${baseUrl}/chat`];

export default function initializeSocketIo(
  httpServer: HttpServer,
  corsOptions?: CorsOptions
) {
  const io = new SocketServer(httpServer, {
    cors: corsOptions,
  });

  // *Middleware*
  io.engine.use(cookieParser());

  namespaces.forEach((nsp) => {
    io.of(nsp).use(verifyUserToken);
    io.of(nsp).use(isUserVerified);
  });

  // *Namespaces*
  io.of(`${baseUrl}/auth`).on("connection", (socket) => {
    // Caches their auth socket ID for getting a certain socket, sending events directly with the socket ID and to know what
    // user's are currently connected, etc.
    redisClient.set(`user:${socket.decodedClaims!.verification_token}:socket_id`, socket.id).then(() => {
        logger.debug(`Client connected to auth namespace; ${socket.id}`);
        authNamespace(socket, io.of(`${baseUrl}/auth`));
      });
  });

  io.of(`${baseUrl}/chat`).on("connection", (socket) => {
    logger.debug(`Client connected to chat namespace; ${socket.id}.`);

    chatNamespace(socket, io.of(`${baseUrl}/chat`));
  });
}
