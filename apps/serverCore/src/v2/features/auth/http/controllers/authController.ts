/**
 * Auth Controller
 *
 * Description:
 * Handles user authentication-related HTTP requests and responses.
 */

import type { Request, Response, NextFunction } from "express";
import type RegisterRequestDto from "@authFeatHttp/dtos/RegisterRequestDto";
import type { LoginRequestDto, GoogleLoginRequestDto } from "@authFeatHttp/dtos/LoginRequestDto";
import type { DeleteNotificationsRequestDto } from "@authFeatHttp/dtos/DeleteNotificationsRequestDto";

import USER_NOT_FOUND_MESSAGE from "@authFeat/constants/USER_NOT_FOUND_MESSAGE";

import { logger } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";
import initializeSession from "@authFeatHttp/utils/initializeSession";

import { getUsers as getUsersService, getUser as getUserService } from "@authFeat/services/authService";
import * as httpAuthService from "@authFeatHttp/services/httpAuthService";
import { loginWithGoogle } from "@authFeatHttp/services/googleService";
import { deleteCsrfToken } from "@authFeatHttp/services/csrfService";

const authService = { getUsers: getUsersService, getUser: getUserService, ...httpAuthService }

/**
 * Starts the user registration and checks if the user already exits within the database.
 * @controller
 * @response `success`, `conflict`, `HttpError` or `ApiError`.
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
          "A user with this email address already exists. Please try using a different email address."
      });

    await authService.registerUser({ ...req.body, type: "standard" });

    return res.status(200).json({
      message:
        "Successfully registered! You can now log in with your newly created profile."
    });
  } catch (error: any) {
    next(handleHttpError(error, "register controller error."));
  }
}

// TODO: Might get rid of login with username.
/**
 * Initializes the current user session.
 * @controller
 * @response `success` with the client formatted user, `internal`, or `HttpError`.
 */
export async function login(
  req: LoginRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    const clientUser = await initializeSession(
      res,
      {
        by: req.loginMethod!,
        value: req.body.email_username,
      },
      req.headers["x-xsrf-token"] as string
    );
    delete req.loginMethod;
    if (typeof clientUser === "string")
      return res.status(404).json({
        ERROR: `${clientUser} ${USER_NOT_FOUND_MESSAGE}`
      });

    return res.status(200).json({
      message: "User session created successfully.",
      user: clientUser
    });
  } catch (error: any) {
    next(handleHttpError(error, "login controller error."));
  }
}
/**
 * Initializes the current user session.
 * @controller
 * @response `success`, `forbidden`, or `HttpError`.
 */
export async function loginGoogle(
  req: GoogleLoginRequestDto,
  res: Response,
  next: NextFunction
) {
  logger.debug("/auth/login/google body:", req.body);

  try {
    const clientUser = await loginWithGoogle(req, res);

    return res.status(200).json({
      message: "User session created successfully.",
      user: clientUser
    });
  } catch (error: any) {
    next(handleHttpError(error, "loginGoogle controller error."));
  }
}

/**
 * Initiates email address verification.
 * @controller
 * @response `success`, `not found`, `forbidden`, or `HttpError`.
 */
export async function emailVerify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { sub, verification_token } = req.decodedClaims!,
      result = await authService.emailVerify(sub, verification_token);

    return res
      .status(200)
      .json({ message: "Email address successfully verified.", user: result });
  } catch (error: any) {
    next(handleHttpError(error, "emailVerify controller error."));
  }
}
/**
 * Initiates verification email sending.
 * @controller
 * @response `success`, `SMTP rejected` or `HttpError`.
 */
export async function sendVerifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, verification_token } = req.decodedClaims!;
    await authService.sendVerifyEmail(email, verification_token);

    return res.status(200).json({
      message:
        "Verification email successfully sent. If you can't find it in your inbox, please check your spam or junk folder."
    });
  } catch (error: any) {
    next(handleHttpError(error, "sendVerifyEmail controller error."));
  }
}

/**
 * Send all users or searched users by username, client formatted.
 * @controller
 * @response `success` with all users formatted for the client, `forbidden`, `HttpError` or `ApiError`.
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const query = req.query.username as string;
  let clientUsers;

  try {
    if (query) clientUsers = await authService.searchUsers(query);
    else { 
      if (process.env.NODE_ENV !== "development")
        return res.status(403).json({ ERROR: "Access denied." });

      clientUsers = await authService.getUsers(true);
    }

    return res.status(200).json({
      message: `Successfully retrieved ${query ? "searched" : "all"} users.`,
      users: clientUsers
    });
  } catch (error: any) {
    next(handleHttpError(error, "getUsers controller error."));
  }
}

/**
 * Send a user or current user or even a user's notifications, client formatted.
 * @controller
 * @response `success` with the current user formatted for the client, `not found`, `forbidden`, `HttpError` or `ApiError`.
 */
export async function getUser(req: Request, res: Response, next: NextFunction) {
  const query = req.query as Record<string, string>;

  if (query.email && process.env.NODE_ENV !== "development")
    return res.status(403).json({ ERROR: "Access denied." });

  try {
    let clientUser = await authService.getUser(
      query.email ? "email" : "_id",
      query.email || req.decodedClaims!.sub,
      !query.notifications
    );
    if (!clientUser)
      return res.status(404).json({ ERROR: "User doesn't exist." });

    if (query.notifications) {
      const result = await httpAuthService.getSortedUserNotifications(clientUser._id);
      clientUser = {
        friend_requests: clientUser!.notifications.friend_requests,
        notifications: result.notifications
      } as any;
    }

    return res.status(200).json({
      message: 
        `Successfully retrieved ${query.notifications ? "the user's notifications" : query.email ? `user ${query.email}` : "the current user"}.`,
      user: clientUser
    });
  } catch (error: any) {
    next(handleHttpError(error, "getUser controller error."));
  }
}

/**
 * Clears every refresh token, csrf token and cookies from the current user.
 * @controller
 * @response `success` or `HttpError`.
 */
export async function clear(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.wipeUser(req.decodedClaims!.sub);

    return res.status(200).clearCookie("session").clearCookie("refresh").json({
      message: "All refresh and csrf tokens successfully removed."
    });
  } catch (error: any) {
    next(handleHttpError(error, "clear controller error."));
  }
}

/**
 * Deletes the current user.
 * @controller
 * @response `success`, or `HttpError`.
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.decodedClaims!.sub;

    await authService.deleteUser(userId);

    return res.status(200).json({ message: `User ${userId} successfully deleted.` });
  } catch (error: any) {
    next(handleHttpError(error, "deleteUser controller error."));
  }
}
/**
 * Deletes the given user notifications.
 * @controller
 * @response `success` with sorted notifications, or `HttpError`.
 */
export async function deleteUserNotifications(
  req: DeleteNotificationsRequestDto, 
  res: Response, 
  next: NextFunction
) {
  const toDelete = req.body.notifications;

  try {
    const result = await httpAuthService.deleteUserNotifications(
      req.decodedClaims!.sub,
      toDelete,
      req.body.categorize
    );

    return res.status(200).json({
      message: `Successfully deleted ${toDelete.length} notifications from current user.`,
      user: { notifications: result.notifications },
    });
  } catch (error: any) {
    next(handleHttpError(error, "deleteUserNotifications controller error."));
  }
}

/**
 * Clears the session cookie and deletes the csrf token.
 * @controller
 * @response `success`, `internal`, `HttpError` or `ApiError`.
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.getUser("username", req.body.username);
    if (!user)
      return res.status(500).json({
        ERROR: "Unexpectedly couldn't find the user after login."
      });

    await deleteCsrfToken(user.id, req.headers["x-xsrf-token"] as string);

    return res
      .status(200)
      .clearCookie("session").clearCookie("refresh")
      .json({ message: "Session cleared, log out successful." });
  } catch (error: any) {
    next(handleHttpError(error, "logout controller error."));
  }
}
