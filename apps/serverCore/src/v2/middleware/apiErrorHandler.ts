import { Request, Response, NextFunction } from "express";
import { logger } from "@qc/utils";
import { ApiError } from "@utils/CustomError";

export default function apiErrorHandler(
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(error.stack || error);
  const err: any = error;

  return res.status(err.statusCode || 500).json({
    message: err.from || "An unexpected error occurred.",
    ERROR: err.message,
  });
}
