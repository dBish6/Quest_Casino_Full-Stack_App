/**
 * Auth Controller
 *
 * Description:
 * Handles user authentication-related HTTP requests and responses.
 */

import type { Request, Response, NextFunction } from "express";
import type RegisterRequestDto from "@authFeat/dtos/RegisterRequestDto";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";
import initializeSession from "@authFeat/utils/initializeSession";

import * as authService from "@authFeat/services/authService";
import { deleteCsrfToken } from "@authFeat/services/csrfService";

/**
 * Send all users as client formatted users.
 * @controller
 * @response ClientUser[] or ApiError.
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await authService.getUsers(true);

    return res.status(200).json(users);
  } catch (error: any) {
    next(createApiError(error, "getUsers controller error.", 500));
  }
}

/**
 * Send a client formatted user or current user.
 * @controller
 * @response ClientUser or ApiError.
 */
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const query = req.query.email as string;

  try {
    const user = await authService.getUser(
      query ? "email" : "_id",
      query || req.decodedClaims!.sub,
      true
    );
    if (!user)
      return res.status(404).json({
        message: "User doesn't exist.",
      });

    return res.status(200).json({ user });
  } catch (error: any) {
    error.reason = "failed to send specified user.";
    next(createApiError(error, "getUser controller error.", 500));
  }
}

/**
 * Starts the user registration and checks if the user already exits within the database.
 * @controller
 * @response A success message, bad request, or ApiError.
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
      return res.status(400).json({
        message: "User already exists.",
      });
    // TODO: Unique usernames.

    await authService.registerStandardUser(req);

    return res.status(200).json({
      message:
        "Successfully registered! To complete the process and log in with your newly created profile, we've sent a verification email to your specified email address. If you don't see it in your inbox, please check your junk/spam folder or resend.",
    });
  } catch (error: any) {
    next(createApiError(error, "register controller error.", 500));
  }
}

/**
 * Initializes the current user session.
 * @controller
 * @response The client formatted user and success message or ApiError.
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const clientUser = await initializeSession(res, req.decodedClaims!.sub);

    return res.status(200).json({
      message: "User session created successfully.",
      user: clientUser,
    });
  } catch (error: any) {
    next(createApiError(error, "login controller error.", 500));
  }
}

/**
 * Initiates email address verification.
 * @controller
 * @response A success message, not found, forbidden, or ApiError.
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
        message: result,
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
 * @response A success message or ApiError.
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
    next(createApiError(error, "emailVerify controller error.", 500));
  }
}

/**
 * Clears the session cookie and deletes the csrf token.
 * @controller
 * @response A success message or ApiError.
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
 * @response A success message or ApiError.
 */
export async function clear(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.wipeUser(req.decodedClaims!.sub);

    return res.status(200).clearCookie("session").clearCookie("refresh").json({
      message: "All refresh and csrf tokens successfully removed.",
    });
  } catch (error: any) {
    next(createApiError(error, "clearSessions controller error.", 500));
  }
}

/**
 * Deletes the current user.
 * @controller
 * @response A success message or ApiError.
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
