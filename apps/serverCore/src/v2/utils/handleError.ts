import type SocketCallback from "@typings/SocketCallback";

import { logger } from "@qc/utils";

export class ApiError extends Error {
  statusCode: number;
  status: string;
  from?: string;

  constructor(message: string, statusCode = 500, status = "internal error", from?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = status;
    this.from = from;
  }
}

export class HttpError extends ApiError {
  constructor(message: string, statusCode = 500, from?: string) {
    super(message, statusCode, "", from);
    this.name = "HttpError";
  }
}

export class SocketError extends ApiError {
  constructor(message: string, status = "internal error", from?: string) {
    super(message, 0, status, from);
    this.name = "SocketError";
  }
}

/**
 * Use for 'critical' errors for both `http` and `socket`.
 */
export function handleApiError(
  error: HttpError | SocketError | Error,
  from: string,
  status?: { code: number, text: string }
) {
  if (error instanceof HttpError || error instanceof SocketError) {
    error.from = error.from || from;
    return error;
  } else {
    return new ApiError(
      error.message || "An unexpected error occurred.", status?.code, status?.text, from
    );
  }
}

/**
 * Use for 'critical' errors for `socket`.
 */
export function handleSocketError(
  callback: SocketCallback,
  error: SocketError | ApiError | Error,
  from: string,
  status?: string
) {
  const err: any = error;

  if ((err.status === "internal error" || err.message?.includes("Unexpectedly")) || !err.status)
    logger.error(err.stack || err);

  callback({
    status: err.status || status || "internal error",
    ...(process.env.NODE_ENV === "development" && {
      message: err.from || from,
    }),
    ERROR: err.message || "An unexpected error occurred.",
  });
}

/**
 * Use for 'critical' errors for `http`.
 */
export function handleHttpError(
  error: HttpError | ApiError | Error,
  from: string,
  statusCode?: number
) {
  if (error instanceof HttpError) {
    error.from = error.from || from;
    return error;
  } else {
    return new HttpError(error.message, statusCode, from);
  }
}
