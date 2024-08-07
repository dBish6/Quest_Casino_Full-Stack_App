import type { Response, NextFunction } from "express";
import type { GoogleLoginRequestDto } from "@authFeatHttp/dtos/LoginRequestDto";

import { randomUUID } from "crypto";
import { compare } from "bcrypt";

import { logger } from "@qc/utils";
import { handleApiError } from "@utils/handleError";

/**
 * Validates the Google credentials (code, state) if they are valid.
 * @middleware
 * @response `unauthorized`, `forbidden`, or `ApiError`.
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

    logger.info("Google login successfully validated.");
    next();
  } catch (error) {
    next(handleApiError(error, "validateGoogleLogin middleware error.", 500));
  }
}
