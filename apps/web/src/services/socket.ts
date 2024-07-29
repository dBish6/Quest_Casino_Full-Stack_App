import type { Socket } from "socket.io-client";
import type { SocketResponse } from "@typings/ApiResponse";

import { io } from "socket.io-client";
import { logger } from "@qc/utils";
import { history } from "@utils/History";

export const namespaces = ["auth", "chat"] as const;
export type SocketNamespaces = (typeof namespaces)[number];
export type TimeoutObj = Partial<Record<SocketNamespaces, NodeJS.Timeout>>;

// const baseUrl = "/socket/v2/socket",
const baseUrl = "http://localhost:4000/api/v2/socket";

const socketInstances: Partial<Record<SocketNamespaces, Socket>> = {};

/**
 * Creates a socket instance only once for a specific namespace.
 */
export function getSocketInstance(namespace: SocketNamespaces): Socket {
  if (!socketInstances[namespace]) {
    const socket = io(`${baseUrl}/${namespace}`, {
      autoConnect: false,
      reconnection: false,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketInstances[namespace] = socket;
  }

  return socketInstances[namespace];
}

export function emitAsPromise(socket: Socket) {
  return <TData extends object>(event: string, data: TData): Promise<any> => {
    return new Promise((resolve) => {
      socket.emit(event, data, (res: SocketResponse<TData>) => {
        if (res.status !== "ok") {
          // Mimics the structure of what RTK does for their FetchBaseQueryError.
          const { status, ...rest } = res
          resolve({ error: { data: { ...rest }, status } });
        } else {
          resolve({ data: res });
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
              if (error.message === "unauthorized") history.push("/error-401");
              else if (error.message === "forbidden") history.push("/error-403");

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
  setupDebugger()
}

function setupDebugger() {
  if (import.meta.env.MODE !== "production") {
    const socket = getSocketInstance("auth"); // They both use the same engine.

    socket.io.engine
      .on("packet", ({ type, data }) =>
        logger.debug("Socket received:", { type: type, data: data })
      )
      .on("packetCreate", ({ type, data }) =>
        logger.debug("Socket sent:", { type: type, data: data })
      );
  }
}

function setupDefaultListeners(socket: Socket, namespace: SocketNamespaces) {
  socket.on("connect_error", (error) =>
    logger.error(
      `Unexpected error occurred from ${namespace} socket instance:\n`, error.message
    )
  );

  socket.on("disconnect", () => {
    console.log("DISCONNECTING");
  });
}
