import type { Response, NextFunction } from "express";
import type { GoogleLoginRequestDto } from "@authFeat/dtos/LoginRequestDto";

import { compare } from "bcrypt";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";

/**
 * Validates the Google register form fields if all other credentials (code, state) are valid.
 * @middleware
 * @response `unauthorized`, `forbidden`, or `ApiError`.
 */
export default async function validateGoogleLogin(
  req: GoogleLoginRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    const { code = "", state = "", stored_state = "" } = req.body || {};
    if (!code || !state)
      return res.status(401).json({ ERROR: "Authorization is missing." });

    if (await compare(state, stored_state))
      return res.status(403).json({ ERROR: "Authorization is invalid." });

    logger.info("Google login successfully validated.");
    next();
  } catch (error) {
    next(createApiError(error, "validateRegister middleware error.", 500));
  }
}
