import type { Response } from "express";
import type { ObjectId } from "mongoose";
import type UserCredentials from "@qc/typescript/typings/UserCredentials";
import type { UserDoc, RegistrationTypes } from "@authFeat/typings/User";

import { createApiError } from "@utils/CustomError";

import { getUser } from "@authFeat/services/authService";
import { GenerateUserJWT } from "@authFeat/services/jwtService";
import {
  deleteCsrfToken,
  generateCsrfToken,
} from "@authFeat/services/csrfService";

export default async function initializeSession(
  res: Response,
  userId?: ObjectId | string | null,
  // TODO: ?
  user?: any,
  csrfToken?: string
) {
  try {
    if (!user) {
      if (!userId)
        throw Error("userId must be provided when no user is passed.");

      user = await getUser("_id", userId);
      if (!user) return "User doesn't exist.";
    }

    const userToClaims = formatUserToClaims(user),
      generateUserJWT = new GenerateUserJWT(userToClaims);

    const accessToken = generateUserJWT.accessToken(),
      [refreshToken, newCsrfToken] = await Promise.all([
        generateUserJWT.refreshToken(),
        generateCsrfToken(user.id),
      ]);

    // TODO: Might need to do this every time?
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

    return formatClientUser(user) as UserCredentials;
  } catch (error: any) {
    throw createApiError(error, "initializeSession error.", 500);
  }
}

function formatUserToClaims(user: UserDoc) {
  return {
    _id: user._id,
    type: user.type as RegistrationTypes,
    legal_name: user.legal_name,
    username: user.username,
    email: user.email,
    verification_token: user.verification_token, // Safe to include in the claims since the token is short-lived, the original verification token is in the cache, and its purpose is for email verification.
    country: user.country,
    region: user.region,
    phone_number: user.phone_number,
  };
}

function formatClientUser(user: UserDoc) {
  const { _id, verification_token, ...shared } = formatUserToClaims(user);
  return {
    ...shared,
    avatar_url: user.avatar_url,
    email_verified: user.email_verified,
    balance: user.balance,
    statistics: {
      losses: user.statistics.losses,
      wins: user.statistics.wins,
      completed_quests: user.statistics.completed_quests,
    },
  };
}
