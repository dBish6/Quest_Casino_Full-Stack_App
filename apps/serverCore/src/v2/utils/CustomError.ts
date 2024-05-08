import { logger } from "@qc/utils";

export class ApiError extends Error {
  statusCode?: number;
  from: string;

  constructor(from: string, message: string, statusCode: number = 500) {
    super(message);
    this.from = from;
    this.statusCode = statusCode;
  }
}

/**
 * Use this in the NextFunction.
 */
export default function sendError(
  err: any,
  from: string,
  statusCode?: number,
  message?: string
) {
  const errorMessage = message || err.message;

  logger.error(`${from}\n`, errorMessage);
  return err instanceof ApiError
    ? err
    : new ApiError(from, errorMessage, statusCode);
}
