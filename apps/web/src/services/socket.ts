import type { Socket } from "socket.io-client";
import type { SocketResponse, ErrorSocketResponse } from "@typings/ApiResponse";

import { io } from "socket.io-client";
import { logger } from "@qc/utils";
import { history } from "@utils/History";

export const namespaces = ["auth", "chat"] as const;
export type SocketNamespaces = (typeof namespaces)[number];
export type TimeoutObj = Partial<Record<SocketNamespaces, NodeJS.Timeout>>;

// const baseUrl = "/socket/v2",
const baseUrl = "http://localhost:4000/socket/v2";
// const baseUrl = ":4000/socket/v2",

/**
 * Creates a socket instance only once for a specific namespace.
 */
export function getSocketInstance(namespace: SocketNamespaces) {
  let socket: Socket;

  const getSocket = () => {
    if (!socket) {
      socket = io(`${baseUrl}/${namespace}`, {
        autoConnect: false,
        reconnection: false,
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
    }

    return socket;
  };

  return getSocket();
}

export function emitAsPromise(socket: Socket) {
  return <TData extends object>(event: string, data: TData): Promise<any> => {
    return new Promise((resolve, reject) => {
      socket.emit(event, data, (res: SocketResponse<TData>) => {
        if (res.status !== "ok") {
          reject(res);
        } else {
          resolve(res);
        }
      });
    });
  };
}

/**
 * Establishes connections to the host for all socket instances and handles retries up to 9 times if the connection fails. Ensures all socket
 * instances are set up appropriately.
 */
export async function socketInstancesConnectionProvider(timeoutObj: TimeoutObj) {
  const connections = namespaces.map(async (namespace) => {
    const socket = getSocketInstance(namespace);

    return new Promise<{ socket: Socket; namespace: SocketNamespaces }>((resolve, reject) => {
        let retries = 9;

        if (socket.connected) {
          resolve({ socket, namespace });
        } else {
          socket
            .on("connect", () => {
              logger.debug(`Connection established for ${namespace} socket; ${socket.id}`);

              socket.removeAllListeners();
              resolve({ socket, namespace });
            })
            .on("connect_error", (error) => {
              logger.error(`${namespace} socket instance connection error:\n`, error.message);

              const timeout = setTimeout(() => attemptConnection(), 5000);
              timeoutObj[namespace] = timeout;
            });

          const attemptConnection = () => {
            retries--;
            logger.debug(
              `${namespace} socket instance attempting to establish a connection; ${retries} retries left...`
            );
            socket.connect();

            if (retries === 0) {
              socket.removeAllListeners();
              reject(
                new Error(
                  `Failed to establish a stable connection with ${namespace} socket instance.`
                )
              );
            }
          };
          attemptConnection();
        }
      }
    ).then(({ socket, namespace }) => setupDefaultListeners(socket, namespace));
  });

  await Promise.all(connections);
}

function setupDefaultListeners(socket: Socket, namespace: SocketNamespaces) {
  const engine = socket.io.engine,
    engineLogs = true;

  socketErrorHandler(socket, namespace);

  if (import.meta.env.MODE !== "production" && engineLogs) {
    engine
      .on("packet", ({ type, data }) => 
        logger.debug(`${namespace} received:`, { type: type, data: data })
      )
      .on("packetCreate", ({ type, data }) =>
        logger.debug(`${namespace} Sent:`, { type: type, data: data })
      );
  }
}
function socketErrorHandler(socket: Socket, namespace: SocketNamespaces) {
  socket
    .on("connect_error", (error) => 
      logger.error(
        `Unexpected error occurred from ${namespace} socket instance:\n`, error.message
      )
    )
    .on("error", (error: ErrorSocketResponse) => {
      // Not sure how I want to do this yet.
      switch (error.status) {
        case "bad request":
          error.message.includes("leave", -1) && history.push("/error-500");
          break;
        case "internal error":
          history.push("/error-500");
          break;
        default:
          break;
      }
    });
}
