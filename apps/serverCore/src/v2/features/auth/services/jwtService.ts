/**
 * JWT Service
 *
 * Description:
 * Handles functionally of the user's token.
 */

import type User from "@authFeat/typings/UserDoc";
import jwt from "jsonwebtoken";
import { ApiError } from "@utils/CustomError";
import { redisClient } from "@cache";

export const generateJWT = {
  accessToken: (user: User) => {
    const { _id, ...userData } = user;

    try {
      return jwt.sign(
        { sub: _id, ...userData },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          algorithm: "HS256",
          expiresIn: "15m",
        }
      );
    } catch (error: any) {
      throw new ApiError(
        "generateJWT service error; generating access token.",
        error.message
      );
    }
  },

  refreshToken: async (user: User) => {
    const { _id, ...userData } = user;

    try {
      const refreshToken = jwt.sign(
        { sub: _id, ...userData },
        process.env.REFRESH_TOKEN_SECRET!,
        {
          algorithm: "HS256",
          expiresIn: "7d",
        }
      );
      // Cache the refresh token to Redis for verification afterwards.
      await redisClient.sAdd(`user:${_id}:refresh_tokens`, refreshToken);

      return refreshToken;
    } catch (error: any) {
      throw new ApiError(
        "generateJWT service error; generating refresh token.",
        error.message
      );
    }
  },
};

export const isRefreshTokenValid = async (userId: string, token: string) => {
  try {
    return await redisClient.sIsMember(`user:${userId}:refreshTokens`, token);
  } catch (error: any) {
    throw new ApiError("isRefreshTokenValid service error.", error.message);
  }
};

export async function clearSession(userId: string, refreshToken: string) {
  try {
    await redisClient.sRem(`user:${userId}:refreshTokens`, refreshToken);
  } catch (error: any) {
    throw new ApiError("clearSession service error.", error.message);
  }
}

export async function clearAllSessions(userId: string) {
  try {
    await redisClient.del(`user:${userId}:refreshTokens`);
  } catch (error: any) {
    throw new ApiError("clearAllSessions service error.", error.message);
  }
}
