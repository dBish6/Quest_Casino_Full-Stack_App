/**
 * Quest Casino API (back-end)
 * Version: 2.0.0-pre
 *
 * Author: David Bishop
 * Creation Date: April 16, 2024
 * Last Updated: May 8, 2024
 *
 * Description:
 * ...
 *
 * Features:
 *  - Authentication:
 *    - Json Web Tokens and cookies for session.
 *    - Support for multiple sessions.
 *    - Access and refresh tokens.
 *  - Real-time chat using Socket.io.
 *  ...
 *
 * Change Log (Not yet, when it's released it would be):
 * The log is in the changelog.txt file at the base of this web directory.
 */

import { createServer } from "http";

import Db from "@model/Db";
import establishRedisConnection from "./cache";
import initializeApi from "./api";
import initializeSocket from "./socket";

export const setupServer = async () => {
  const { PROTOCOL, HOST, PORT: ENV_PORT } = process.env,
    PORT = Number(ENV_PORT) || 4000,
    corsOptions = {
      origin: ["http://localhost:3000"],
      credentials: true,
    };

  const db = new Db();
  db.connectBaseCluster();

  await establishRedisConnection();

  const app = initializeApi(corsOptions),
    httpServer = createServer(app);

  initializeSocket(httpServer, corsOptions);

  httpServer.listen(PORT, HOST!, async () => {
    try {
      console.log(
        `Server is running on ${PROTOCOL}${HOST}:${PORT}; Ctrl-C to terminate...`
      );
    } catch (error: any) {
      console.error("Server start error:\n" + error.message);
    }
  });
};

setupServer();
