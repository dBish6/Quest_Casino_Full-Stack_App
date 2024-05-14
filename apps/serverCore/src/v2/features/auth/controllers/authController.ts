import type { Request, Response, NextFunction } from "express";
import type RegisterRequestDto from "@authFeat/dtos/RegisterRequestDto";
import type { UserToClaims } from "@authFeat/typings/User";

import { CLIENT_USER_FIELDS } from "@authFeat/constants/USER_QUERIES";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";
import initializeSession from "@authFeat/utils/initializeSession";

import * as authService from "@authFeat/services/authService";
import { deleteCsrfToken } from "@authFeat/services/csrfService";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await authService.getUsers();

    return res.status(200).json(users);
  } catch (error: any) {
    next(createApiError(error, "getUsers controller error.", 500));
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (await authService.getUser(
      "_id",
      req.decodedClaims!.sub,
      CLIENT_USER_FIELDS
    )) as UserToClaims;
    if (!user)
      return res.status(404).send({
        message: "User doesn't exist.",
      });

    // console.log("user", user);

    return res.status(200).json({ user });
  } catch (error: any) {
    error.reason = "failed to send specified user.";
    next(createApiError(error, "getUser controller error.", 500));
  }
}

export async function register(
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) {
  logger.debug("/auth/register body:", req.body);

  try {
    const user = await authService.getUser("email", req.body.email);
    if (user)
      return res.status(404).send({
        message: "User already exists.",
      });

    await authService.registerStandardUser(req);

    return res.status(200).json({
      message:
        "Successfully registered, proceed to log in with your newly created profile!",
    });
  } catch (error: any) {
    next(createApiError(error, "register controller error.", 500));
  }
}

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

export async function emailVerify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await authService.emailVerify(req.decodedClaims!.email);

    return res.status(200).json(user);
  } catch (error: any) {
    next(createApiError(error, "emailVerify controller error.", 500));
  }
}

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
 * Clears every session, csrf token and cookies.
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
