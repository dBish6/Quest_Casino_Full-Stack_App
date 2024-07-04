import { Request, Response, NextFunction } from "express";
import { logger } from "@qc/utils";
import { ApiError } from "@utils/handleError";

export default function apiErrorHandler(
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.stack || error);
  const err: any = error;

  return res.status(err.statusCode || 500).json({
    ...(process.env.NODE_ENV !== "production" && {
      message: err.from || "An unexpected error occurred.",
    }),
    ERROR: err.message,
  });
}
