import type { Request, Response, NextFunction } from "express";
import RegisterRequestDto from "@authFeat/dtos/RegisterRequestDto";
// import GetUserDto from "../dtos/GetUserDto";

import sendError from "@utils/CustomError";

import * as authService from "../services/authService";
import * as jwtService from "../services/jwtService";
import {
  deleteCsrfToken,
  deleteAllCsrfTokens,
} from "@csrfFeat/services/csrfService";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await authService.getUsers(req.decodedClaims!.sub);

    return res.status(200).json(users);
  } catch (error: any) {
    next(sendError(error, "getUsers controller error.", 500));
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getUser(req.decodedClaims!.sub);
    if (!user)
      return res.status(404).send({
        message: "User doesn't exist.",
      });

    // const passwordlessUser = {user.password, ...user}

    return res.status(200).json(user);
  } catch (error: any) {
    error.reason = "failed to send specified user.";
    next(sendError(error, "getUser controller error.", 500));
  }
}

export async function register(
  req: RegisterRequestDto,
  res: Response,
  next: NextFunction
) {
  // logger.debug("/auth/api/firebase/register body:", req.body);

  try {
    const user = await authService.getUser(req.body.email);
    if (!user)
      return res.status(404).send({
        message: "User doesn't exist, incorrect email.",
      });

    await authService.registerStandardUser(req);

    return res.status(200).json(user);
  } catch (error: any) {
    next(sendError(error, "register controller error.", 500));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // const sessionCookie = await jwtService.initializeSession(req.userIdToken!);
    // return res
    //   .status(200)
    //   .cookie("session", sessionCookie, {
    //     path: "/",
    //     // maxAge: 1000 * 60 * 15, // 15 minutes.
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //   })
    //   .json({ message: "User session created successfully." });
  } catch (error: any) {
    next(sendError(error, "login controller error.", 500));
  }
}

export async function emailVerify(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // FIXME: Email should not be optional.
    const user = await authService.emailVerify(req.decodedClaims!.email!);

    return res.status(200).json(user);
  } catch (error: any) {
    next(sendError(error, "emailVerify controller error.", 500));
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
    next(sendError(error, "logout controller error.", 500));
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
    next(sendError(error, "deleteUser controller error.", 500));
  }
}

/**
 * Clears every session.
 */
export async function clearSessions(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.decodedClaims!.sub;

    // await Promise.all([
    //   authService.clearAllSessions(userId),
    //   deleteAllCsrfTokens(userId),
    // ]);

    return res.status(200).clearCookie("session").json({
      message: "All refresh and csrf tokens successfully removed.",
    });
  } catch (error: any) {
    next(sendError(error, "clearSessions controller error.", 500));
  }
}
