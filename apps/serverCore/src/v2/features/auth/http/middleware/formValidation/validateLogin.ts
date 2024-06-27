import type { Response, NextFunction } from "express";
import type { LoginRequestDto } from "@authFeatHttp/dtos/LoginRequestDto";

import { compare } from "bcrypt";

import { logger } from "@qc/utils";
import { handleApiError } from "@utils/handleError";
import validateEmail from "@authFeatHttp/utils/validateEmail";

import { getUser } from "@authFeatHttp/services/httpAuthService";

/**
 * Validates the standard login form fields.
 * @middleware
 * @response `bad request`, or `ApiError`.
 */
export default async function validateLogin(
  req: LoginRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    const error = validateEmail(req.body.email_username),
      loginMethod = !error ? "email" : "username";

    const user = await getUser(loginMethod, req.body.email_username);
    if (!user)
      return res.status(400).json({
        ERROR: "Email or username is incorrect.",
      });

    if (user.password === "google provided")
      return res.status(400).json({
        ERROR: `This profile is linked with Google. Please use the "Google" button below to log in.`,
      });

    if (!(await compare(req.body.password, user.password)))
      return res.status(400).json({
        ERROR: "Incorrect password.",
      });

    req.loginMethod = loginMethod;
    logger.info("Login form submission successfully validated.");
    next();
  } catch (error) {
    next(handleApiError(error, "validateLogin middleware error.", 500));
  }
}
