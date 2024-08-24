import { Request, Response, NextFunction } from "express";
import { logger } from "@qc/utils";
import { ApiError } from "@utils/handleError";

export default function apiErrorHandler(
  error: ApiError | Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  const err: any = error;

  if (
    err.statusCode === 500 ||
    err.message?.toLowerCase().includes("unexpectedly") ||
    !err.statusCode
  )
    logger.error(err.stack || err);

  return res.status(err.statusCode || 500).json({
    ...(process.env.NODE_ENV === "development" && {
      message: err.from || "unknown"
    }),
    ERROR: err.message || "An unexpected error occurred."
  });
}
