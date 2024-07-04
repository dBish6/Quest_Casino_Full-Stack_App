import type { Socket } from "socket.io";

import { logger } from "@qc/utils";

export class ApiError extends Error {
  from: string;
  statusCode: number;

  constructor(message: string, from: string, statusCode: number = 500) {
    super(message);
    this.from = from;
    this.statusCode = statusCode;
  }
}

/**
 * Use for 'critical' errors.
 */
export function handleApiError(err: any, from: string, statusCode?: number) {
  return err instanceof ApiError
    ? err
    : new ApiError(err.message, from, statusCode);
}

export function handleSocketError(
  socket: Socket,
  err: any,
  formatErr: { status?: string; from: string }
) {
  logger.error(err.stack || err);

  socket.emit("error", {
    status: formatErr.status || "internal error",
    ...(process.env.NODE_ENV !== "production" && { message: formatErr.from }),
    ERROR: err.message || "An unexpected error occurred.",
  });
}
