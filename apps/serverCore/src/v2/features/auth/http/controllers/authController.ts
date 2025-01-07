/**
 * Auth Controller
 *
 * Description:
 * Handles user authentication-related HTTP requests and responses.
 */

import type { Request, Response, NextFunction } from "express";

import type RegisterRequestDto from "@authFeatHttp/dtos/RegisterRequestDto";
import type { LoginRequestDto, GoogleLoginRequestDto } from "@authFeatHttp/dtos/LoginRequestDto";
import type { UpdateProfileRequestDto, UpdateUserFavouritesRequestDto, SendConfirmPasswordEmailRequestDto } from "@authFeatHttp/dtos/UpdateUserRequestDto";
import type { DeleteNotificationsRequestDto } from "@authFeatHttp/dtos/DeleteNotificationsRequestDto";
import type LogoutRequestDto from "@authFeatHttp/dtos/LogoutRequestDto";

import GENERAL_BAD_REQUEST_MESSAGE from "@constants/GENERAL_BAD_REQUEST_MESSAGE";

import { logger } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";
import initializeSession from "@authFeatHttp/utils/initializeSession";
import updateUserSession from "@authFeatHttp/utils/updateUserSession";

import { User } from "@authFeat/models";
import { getUsers as getUsersService, getUser as getUserService } from "@authFeat/services/authService";
import * as httpAuthService from "@authFeatHttp/services/httpAuthService";
import { loginWithGoogle } from "@authFeatHttp/services/googleService";

const VERIFICATION_EMAIL_SUCCESS_MESSAGE = "Verification email successfully sent. The verification link will expire in 20 minutes. If you can't find it in your inbox, please check your spam or junk folder.";

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
    const exists = await User.exists({ email: req.body.email });
    if (exists)
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

/**
 * Initializes the current user session.
 * @controller
 * @response `success` with the client formatted user, `not found`, or `HttpError`.
 */
export async function login(
  req: LoginRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    const clientUser = await initializeSession(
      res,
      { by: "email", value: req.body.email },
      req.headers["x-xsrf-token"] as string
    );
    if (typeof clientUser === "string")
      return res.status(404).json({ ERROR: clientUser });

    return res.status(200).json({
      message: "User session created successfully.",
      user: clientUser
    });
  } catch (error: any) {
    next(handleHttpError(error, "login controller error."));
  }
}
/**
 * Initializes the current user session via google.
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
  req: Request<{}, {}, { verification_token?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const updatedUser = await authService.emailVerify(
      req.userDecodedClaims!.sub
    );
    // Updates the access and refresh tokens and cookies.
    const { session, refresh } = req.cookies;
    await updateUserSession(req, res, updatedUser, {
      access: session,
      refresh
    });

    return res.status(200).json({
      message: "Email address successfully verified. Please close your previous tab.",
      user: { email_verified: updatedUser.email_verified }
    });
  } catch (error: any) {
    next(handleHttpError(error, "emailVerify controller error."));
  }
}
/**
 * Initiates verification email sending.
 * @controller
 * @response `success`, `SMTP rejected`, or `HttpError`.
 */
export async function sendVerifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await authService.sendVerifyEmail(req.userDecodedClaims!);

    return res.status(200).json({ message: VERIFICATION_EMAIL_SUCCESS_MESSAGE });
  } catch (error: any) {
    next(handleHttpError(error, "sendVerifyEmail controller error."));
  }
}

/**
 * Send all users or searched users by username, client formatted.
 * @controller
 * @response `success` with all users formatted for the client, `forbidden`, `HttpError` or `ApiError`.
 */
export async function getUsers(req: Request, res: Response, next: NextFunction) {
  const { username, count } = req.query as Record<string, string>;
  let clientUsers;

  try {
    if (username) {
      // Search for username.
      clientUsers = await authService.searchUsers(username);
    } else if (!count && process.env.NODE_ENV !== "development") {
      // All users is restricted.
      return res.status(403).json({ ERROR: "Access Denied" });
    } else {
      // Else a random set of users based on count if provided.
      clientUsers = await authService.getUsers(true, parseInt(count, 10));
    }

    return res.status(200).json({
      message: `Successfully retrieved ${username ? "searched" : count ? `random ${count}` : "all"} users.`,
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
  const { notifications, email } = req.query as Record<string, string>;

  if (email && process.env.NODE_ENV !== "development")
    return res.status(403).json({ ERROR: "Access Denied" });

  try {
    let clientUser = await authService.getUser(
      email ? "email" : "_id",
      email || req.userDecodedClaims!.sub,
      {
        forClient: !notifications,
        ...(notifications && { projection: "notifications" }),
        lean: true
      }
    );
    if (!clientUser)
      return res.status(404).json({ ERROR: "User doesn't exist." });

    if (notifications) {
      const result = await httpAuthService.getSortedUserNotifications(clientUser._id);
      clientUser = {
        friend_requests: clientUser!.notifications.friend_requests,
        notifications: result.notifications
      } as any;
    }

    return res.status(200).json({
      message: 
        `Successfully retrieved ${notifications ? "the current user's notifications" : email ? `user ${email}` : "the current user"}.`,
      user: clientUser
    });
  } catch (error: any) {
    next(handleHttpError(error, "getUser controller error."));
  }
}

/**
 * Sends the current user's profile data to be displayed and or edited on the user's private profile page.
 * @controller
 * @response `success` with the current user formatted for the client, `not found`, `forbidden`, `HttpError` or `ApiError`.
 */
export async function getUserProfile(req: Request, res: Response, next: NextFunction) {
  // TODO: For the view profile page.
  const username = req.query.username as string;

  try {
    const profileData = await authService.getUserProfile(
      username ? username : req.userDecodedClaims!.sub
    );

    return res.status(200).json({
      message: "Successfully retrieved the user's profile data.",
      user: profileData
    });
  } catch (error: any) {
    next(handleHttpError(error, "getUserProfile controller error."));
  }
}

/**
 * Initiates the update of the user's client profile and updates the session if needed.
 * @controller
 * @response `success` with updated user, `bad request`, `not found`, `forbidden`, `conflict`, `too many requests`, or `HttpError`.
 */
export async function updateProfile(
  req: UpdateProfileRequestDto, 
  res: Response, 
  next: NextFunction
) {
  const body = req.body;
  logger.debug("/auth/user PATCH body:", body);
  
  try {
    if (!Object.values(req.body).length) return res.status(400).json({ ERROR: "There was no data provided." });
    const user = req.userDecodedClaims!;

    const { updatedUser, updatedFields } = await authService.updateProfile(user, body);
    
    // Updates the access and refresh tokens and cookies if the email was updated.
    if (updatedUser) {
      const { session, refresh } = req.cookies;
      await updateUserSession(req, res, updatedUser, {
        access: session,
        refresh
      });
      // Also, sends the verification email again.
      authService.sendVerifyEmail(user);
    }

    return res.status(200).json({
      message: "Profile successfully updated.",
      user: updatedFields,
      ...(updatedUser && { refreshed: VERIFICATION_EMAIL_SUCCESS_MESSAGE })
    });
  } catch (error: any) {
    next(handleHttpError(error, "updateProfile controller error."));
  }
}

/**
 * Initiates storing or deleting the user's favourite games.
 * @controller
 * @response `success` with updated favourites, `bad request`, or `HttpError`.
 */
export async function updateUserFavourites(
  req: UpdateUserFavouritesRequestDto, 
  res: Response, 
  next: NextFunction
) {
  const favourites = req.body.favourites;

  try {
    if (!Array.isArray(favourites) || !favourites.length)
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });

    const updatedFavourites = await authService.updateUserFavourites(
      req.userDecodedClaims!.sub,
      req.body.favourites
    );

    return res.status(200).json({ 
      message: "Successfully updated the user's favourites.",
      favourites: updatedFavourites
    });
  } catch (error: any) {
    next(handleHttpError(error, "updateUserFavourites controller error."));
  }
}

/**
 * Initiates the change of the user's password from the confirmation request.
 * @controller
 * @response `success`, `not found`, `too many requests`, or `HttpError`.
 */
export async function resetPassword(
  req: Request<{}, {}, { verification_token?: string }>, 
  res: Response, 
  next: NextFunction
) {
  logger.debug("/auth/user/reset-password body:", req.body);

  try {
    const { sub, email } = req.verDecodedClaims!;
    authService.resetPassword(sub, email);

    return res.status(200).clearCookie("session").clearCookie("refresh").json({
      message: "Your password has been successfully reset. All active sessions have been terminated, you'll need to log in again."
    });
  } catch (error: any) {
    next(handleHttpError(error, "resetPassword controller error."));
  }
}

/**
 * Handles password confirmation requests from the profile or reset form and sends an email on success. 
 * Accepts either an old/new password combination or a verification token with a new password.
 * @controller
 * @response `success`, `bad request`, `forbidden`, `not found`, `too many requests`, `SMTP rejected`, or `HttpError`.
 */
export async function sendConfirmPasswordEmail(
  req: SendConfirmPasswordEmailRequestDto,
  res: Response,
  next: NextFunction
) {
  logger.debug("/auth/user/reset-password/confirm body:", req.body);
  const { password } = req.body;

  try {
    if (typeof password === "object") {
      if (!password.old && !password.new) return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });
    } else if (typeof password !== "string") {
      return res.status(403).json({ ERROR: "Access Denied" });
    }
 
    const { sub, email } = req.verDecodedClaims || req.userDecodedClaims!;
    await authService.sendConfirmPasswordEmail(sub, email, req.body);

    return res.status(200).json({ 
      message: "To complete your password change, you must confirm this password reset by a confirmation link sent to your email. The link will expire in 15 minutes. If you can't find it in your inbox, please check your spam or junk folder."
    });
  } catch (error: any) {
    next(handleHttpError(error, "sendResetPasswordEmail controller error."));
  }
}

/**
 * Initiates forgot password email sending.
 * @controller
 * @response `success`, `bad request`, `SMTP rejected`, or `HttpError`.
 */
export async function sendForgotPasswordEmail(
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
) {
  const email = req.body.email;
 
  try {
    if (!email) return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });

    await authService.sendForgotPasswordEmail(email);

    return res.status(200).json({ 
      message: "If a profile with the provided email exists, an email with a password reset link has been sent."
    });
  } catch (error: any) {
    next(handleHttpError(error, "sendResetPasswordEmail controller error."));
  }
}

/**
 * Stops the reset password process at confirmation.
 * @controller
 * @response `success` or `HttpError`.
 */
export async function revokePasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.revokePasswordResetConfirmation(req.userDecodedClaims!.sub);

    return res.status(200).json({
      message: "Password reset successfully canceled."
    });
  } catch (error: any) {
    next(handleHttpError(error, "clear controller error."));
  }
}

/**
 * Reinitializes the user session. Mainly for when the tokens reaches the refresh threshold with a socket
 * since sockets cannot update cookies directly, etc.
 * @controller
 * @response `success`, `not found`, or `HttpError`.
 */
export async function refresh(
  req: Request<{}, {}, { username: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.getUser("username", req.body.username, {
      lean: true,
      forClient: true,
      throwDefault404: true
    });

    const refreshResult = await initializeSession(res, {}, user);
    if (typeof refreshResult === "string") 
      return res.status(404).json({ ERROR: refreshResult });

    return res.status(200).json({ message: "Session successfully refreshed." });
  } catch (error: any) {
    next(handleHttpError(error, "refresh controller error."));
  }
}

/**
 * Clears the session cookie and deletes the csrf token.
 * @controller
 * @response `success`, `internal`, `HttpError` or `ApiError`.
 */
export async function logout(
  req: LogoutRequestDto,
  res: Response,
  next: NextFunction
) {
  try {
    await authService.logout(
      {
        access: req.cookies?.session,
        refresh: req.cookies?.refresh
      },
      req.body.username,
      req.headers["x-xsrf-token"] as string
    )
    .catch((error) => {
      if (req.body.lax) res.clearCookie("session").clearCookie("refresh");
      throw error;
    });

    return res
      .status(200)
      .clearCookie("session").clearCookie("refresh")
      .json({ message: "Session cleared, log out successful." });
  } catch (error: any) {
    next(handleHttpError(error, "logout controller error."));
  }
}

/**
 * Clears every refresh token, csrf token and cookies from the current user.
 * @controller
 * @response `success` or `HttpError`.
 */
export async function wipeUser(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.wipeUser(req.userDecodedClaims!.sub);

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
    const userId = req.userDecodedClaims!.sub;

    await authService.deleteUser(userId);

    return res.status(200).json({ message: `User ${userId} successfully deleted.` });
  } catch (error: any) {
    next(handleHttpError(error, "deleteUser controller error."));
  }
}

/**
 * Initiates deletion of the given user notifications.
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
      req.userDecodedClaims!.sub,
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
