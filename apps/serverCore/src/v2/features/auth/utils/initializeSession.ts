import type { Response } from "express";
import type { ObjectId } from "mongoose";
import type { UserDoc } from "@authFeat/typings/User";

import { createApiError } from "@utils/CustomError";

import { getUser } from "@authFeat/services/authService";
import { GenerateUserJWT } from "@authFeat/services/jwtService";
import {
  deleteCsrfToken,
  generateCsrfToken,
} from "@authFeat/services/csrfService";

export default async function initializeSession(
  res: Response,
  userId: ObjectId | string,
  csrfToken?: string
) {
  try {
    const user = await getUser("_id", userId);
    if (!user) return "User doesn't exist.";

    const userToClaims = createUserToClaims(user),
      generateUserJWT = new GenerateUserJWT(userToClaims);

    const accessToken = generateUserJWT.accessToken(),
      [refreshToken, newCsrfToken] = await Promise.all([
        generateUserJWT.refreshToken(),
        generateCsrfToken(user.id),
      ]);

    if (csrfToken) deleteCsrfToken(user.id, csrfToken);

    res
      .cookie("session", accessToken, {
        path: "/",
        maxAge: 1000 * 60 * 15, // 15 minutes.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .cookie("refresh", refreshToken, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .setHeader("x-xsrf-token", newCsrfToken);

    return createClientUser(user);
  } catch (error: any) {
    throw createApiError(error, "initializeSession error.", 500);
  }
}

function createUserToClaims(user: UserDoc) {
  return {
    _id: user._id,
    type: user.type as "standard" | "google",
    legal_name: user.legal_name,
    username: user.username,
    email: user.email,
    country: user.country,
    region: user.region,
    phone_number: user.phone_number,
  };
}

function createClientUser(user: UserDoc) {
  const { _id, ...shared } = createUserToClaims(user);
  return {
    ...shared,
    avatarUrl: user.avatar_url,
    balance: user.balance,
    losses: user.statistics.losses,
    wins: user.statistics.wins,
  };
}
