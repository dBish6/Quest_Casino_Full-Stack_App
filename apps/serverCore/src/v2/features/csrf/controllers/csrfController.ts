import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { hash } from "bcrypt";

import sendError from "@utils/CustomError";

import { redisClient } from "@cache";

export const initializeCsrfToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const csrfToken = randomUUID();

    // await redisClient.hSet("csrf_tokens", req.decodedClaims!.sub, csrfToken);
    // A User can have multiple sessions; this might change.
    await redisClient.sAdd(
      `user:${req.decodedClaims!.sub}:csrf_tokens`,
      csrfToken
    );

    return res.status(200).json({
      message: "CSRF token successfully created.",
      token: await hash(csrfToken, 12),
    });
  } catch (error: any) {
    next(
      sendError(
        error,
        "initializeCsrfToken controller error.",
        error.message,
        500
      )
    );
  }
};
