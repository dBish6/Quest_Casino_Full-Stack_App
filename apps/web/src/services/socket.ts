import { type ManagerOptions, type SocketOptions, io } from "socket.io-client";
import { logger } from "@qc/utils";

// const baseUrl = "/socket/v2",
const baseUrl = "http://localhost:4000/socket/v2",
  options: Partial<ManagerOptions & SocketOptions> = {
    // port: 4000,
    reconnectionAttempts: 8,
    reconnectionDelay: 3500,
    withCredentials: true,
  };

export const instance = {
  auth: io(`${baseUrl}/auth`, options),
  chat: io(`${baseUrl}/chat`, options),
};

const setupSockets = () => {
  for (const [namespace, inst] of Object.entries(instance)) {
    const engine = inst.io.engine,
      engineLogs = true;

    inst.on("connect_error", async (error) => {
      console.error({
        info: "Socket connection error attempting to retry connection...",
        ERROR: error.message,
      });
    });
    inst.on("connect", () => {
      console.log(`Connection established for ${namespace} socket; ${inst.id}`);
    });

    if (import.meta.env.MODE !== "production" && engineLogs) {
      engine.on("packet", ({ type, data }) => {
        logger.debug("Received:", { type: type, data: data }); // Received
      });
      engine.on("packetCreate", ({ type, data }) => {
        logger.debug("Sent:", { type: type, data: data }); // Sent
      });
    }
  }
};

export default setupSockets;
