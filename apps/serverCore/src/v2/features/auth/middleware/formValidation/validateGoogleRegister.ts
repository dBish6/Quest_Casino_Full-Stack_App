import type { Response, NextFunction } from "express";
import type { GoogleRegisterRequestDto } from "@authFeat/dtos/RegisterRequestDto";

import { compare } from "bcrypt";

import { logger } from "@qc/utils";
import { validatePassword, confirmPassword } from "./validateRegister";

/**
 * Validates the Google register form fields if all other credentials (code, state) are valid.
 * @middleware
 */
export default async function validateGoogleRegister(
  req: GoogleRegisterRequestDto,
  res: Response,
  next: NextFunction
) {
  if (!Object.keys(req.body).length || !req.body)
    return res.status(400).json({
      ERROR: "No form field values was given.",
    });

  const { code, state, stored_state, password, con_password } = req.body;
  if (!code || !state)
    return res.status(401).json({ ERROR: "Authorization is missing." });

  if (await compare(state, stored_state))
    return res.status(403).json({ ERROR: "Authorization is invalid." });

  const errors: { password?: string; con_password?: string } = {
    password: undefined,
    con_password: undefined,
  };
  if (password && password.length) errors.password = validatePassword(password);
  else errors.password = "Password is required.";

  if (con_password && con_password.length) {
    const errorMsg = confirmPassword(con_password, password);
    if (errorMsg) {
      errors.password = errorMsg;
      errors.con_password = errorMsg;
    }
  } else {
    errors.con_password = "Please confirm your password.";
  }

  if (errors.password === undefined && errors.con_password === undefined) {
    logger.info("Google register form submission successfully validated.");
    next();
  } else {
    return res.status(400).json({ ERROR: errors });
  }
}
