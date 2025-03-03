import type { Response, NextFunction } from "express";
import type { GoogleLoginRequestDto } from "@authFeatHttp/dtos/LoginRequestDto";

import { randomUUID } from "crypto";
import { compare } from "bcryptjs";

import { logger } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";

/**
 * Validates the Google credentials (code, state) if they are valid.
 * @middleware
 * @response `unauthorized`, `forbidden`, or `HttpError`.
 */
export default async function validateGoogleLogin(
  req: GoogleLoginRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    const { code, state, secret = randomUUID() } = req.body;
    if (!code || !state)
      return res.status(401).json({ ERROR: "Authorization is missing." });

    if (!(await compare(state, secret))) {
      return res.status(403).json({ ERROR: "Authorization is invalid." });
    }

    logger.debug("Google login successfully validated.");
    next();
  } catch (error: any) {
    next(handleHttpError(error, "validateGoogleLogin middleware error."));
  }
}
