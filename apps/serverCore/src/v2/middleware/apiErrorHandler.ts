import { Request, Response, NextFunction } from "express";
import { ApiError } from "@utils/CustomError";

// FIXME: Unexpected error handler for the name??

const apiErrorHandler = async (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`${error.from}:\n`, error.message);

  return res
    .status(error.statusCode!)
    .json({ message: error.from, ERROR: error.message });
};

export default apiErrorHandler;
