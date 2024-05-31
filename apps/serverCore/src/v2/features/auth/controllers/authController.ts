/**
 * Auth Controller
 *
 * Description:
 * Handles user authentication-related HTTP requests and responses.
 */

import type { Request, Response, NextFunction } from "express";
import RegisterRequestDto from "@authFeat/dtos/RegisterRequestDto";
import {
  LoginRequestDto,
  GoogleLoginRequestDto,
} from "@authFeat/dtos/LoginRequestDto";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";
import validateEmail from "@authFeat/utils/validateEmail";
import initializeSession from "@authFeat/utils/initializeSession";

import * as authService from "@authFeat/services/authService";
import { loginWithGoogle } from "@authFeat/services/googleService";
import { deleteCsrfToken } from "@authFeat/services/csrfService";

/**
 * Send all users as client formatted users.
 * @controller
 * @response `success` with all users formatted for the client, or `ApiError`.
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const clientUsers = await authService.getUsers(true);

    return res.status(200).json({
      message: "Successfully retrieved all users.",
      users: clientUsers,
    });
  } catch (error: any) {
    next(createApiError(error, "getUsers controller error.", 500));
  }
}

/**
 * Send a client formatted user or current user.
 * @controller
 * @response `success` with the current user formatted for the client, `not found`, or `ApiError`.
 */
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const query = req.query.email as string;

  try {
    const clientUser = await authService.getUser(
      query ? "email" : "_id",
      query || req.decodedClaims!.sub,
      true
    );
    if (!clientUser)
      return res.status(404).json({
        ERROR: "User doesn't exist.",
      });

    return res.status(200).json({
      message: "Successfully retrieved the current user.",
      user: clientUser,
    });
  } catch (error: any) {
    next(createApiError(error, "getUser controller error.", 500));
  }
}

/**
 * Starts the user registration and checks if the user already exits within the database.
 * @controller
 * @response `success`, `conflict`, or `ApiError`.
 */
export async function register(
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) {
  logger.debug("/auth/register body:", req.body);

  try {
    const user = await authService.getUser("email", req.body.email);
    if (user)
      return res.status(409).json({
        ERROR:
          "A user with this email address already exists. Please try using a different email address.",
      });
    // TODO: Unique usernames.
    await authService.registerUser({ ...req.body, type: "standard" });

    return res.status(200).json({
      message:
        "Successfully registered! You can now log in with your newly created profile.",
    });
  } catch (error: any) {
    next(createApiError(error, "register controller error.", 500));
  }
}

/**
 * Initializes the current user session.
 * @controller
 * @response `success` with the client formatted user, `not found`, or `ApiError`.
 */
export async function login(
  req: LoginRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    const isEmail = validateEmail(req.body.email_username);

    const clientUser = await initializeSession(
      res,
      {
        by: isEmail ? "email" : "username",
        value: req.body.email_username,
      },
      req.headers["x-xsrf-token"] as string
    );
    if (typeof clientUser === "string")
      return res.status(404).json({
        ERROR: clientUser,
      });

    return res.status(200).json({
      message: "User session created successfully.",
      user: clientUser,
    });
  } catch (error: any) {
    next(createApiError(error, "login controller error.", 500));
  }
}
/**
 * Initializes the current user session.
 * @controller
 * @response `success`, `forbidden`, or `ApiError`.
 */
export async function loginGoogle(
  req: GoogleLoginRequestDto,
  res: Response,
  next: NextFunction
) {
  logger.debug("/auth/login/google body:", req.body);

  try {
    const clientUser = await loginWithGoogle(res, req);

    return res.status(200).json({
      message: "User session created successfully.",
      user: clientUser,
    });
  } catch (error: any) {
    next(createApiError(error, "loginGoogle controller error.", 500));
  }
}

/**
 * Initiates email address verification.
 * @controller
 * @response A `success`, `not found`, `forbidden`, or `ApiError`.
 */
export async function emailVerify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { sub, verification_token } = req.decodedClaims!;
    const result = await authService.emailVerify(sub, verification_token);
    if (typeof result === "string")
      return res.status(result === "User doesn't exist." ? 404 : 403).json({
        ERROR: result,
      });

    return res
      .status(200)
      .json({ message: "Email address successfully verified.", user: result });
  } catch (error: any) {
    next(createApiError(error, "emailVerify controller error.", 500));
  }
}
/**
 * Initiates the email verification process.
 * @controller
 * @response `success`, `SMTP rejected` or `ApiError`.
 */
export async function sendVerifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, verification_token } = req.decodedClaims!;
    await authService.sendVerifyEmail(email, verification_token);

    return res
      .status(200)
      .json({ message: "Verification email successfully sent." });
  } catch (error: any) {
    next(createApiError(error, "sendVerifyEmail controller error.", 500));
  }
}

/**
 * Clears the session cookie and deletes the csrf token.
 * @controller
 * @response `success` or `ApiError`.
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteCsrfToken(
      req.decodedClaims!.sub,
      req.headers["x-xsrf-token"] as string
    );

    return res
      .status(200)
      .clearCookie("session")
      .json({ message: "Session cleared, log out successful." });
  } catch (error: any) {
    next(createApiError(error, "logout controller error.", 500));
  }
}

/**
 * Clears every refresh token, csrf token and cookies.
 * @controller
 * @response `success` or `ApiError`.
 */
export async function clear(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.wipeUser(req.decodedClaims!.sub);

    return res.status(200).clearCookie("session").clearCookie("refresh").json({
      message: "All refresh and csrf tokens successfully removed.",
    });
  } catch (error: any) {
    next(createApiError(error, "clear controller error.", 500));
  }
}

/**
 * Deletes the current user.
 * @controller
 * @response `success` or `ApiError`.
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.decodedClaims!.sub;

    await authService.deleteUser(userId);

    return res
      .status(200)
      .json({ message: `User ${userId} successfully deleted.` });
  } catch (error: any) {
    next(createApiError(error, "deleteUser controller error.", 500));
  }
}
