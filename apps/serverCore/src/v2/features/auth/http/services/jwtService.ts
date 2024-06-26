/**
 * JWT Service
 *
 * Description:
 * Handles functionally of the user's access and refresh tokens.
 */

import type { Secret, SignOptions } from "jsonwebtoken";
import type { UserToClaims } from "@authFeatHttp/typings/User";

import jwt from "jsonwebtoken";

import { handleApiError } from "@utils/handleError";
import { redisClient } from "@cache";

export class GenerateUserJWT {
  user: UserToClaims;

  constructor(user: UserToClaims) {
    this.user = user;
  }

  #token(secret: Secret, options?: SignOptions) {
    return jwt.sign({ sub: this.user._id.toString(), ...this.user }, secret, {
      algorithm: "HS256",
      expiresIn: "15m",
      ...options,
    });
  }

  accessToken(options?: SignOptions) {
    try {
      return this.#token(process.env.ACCESS_TOKEN_SECRET!, options);
    } catch (error: any) {
      throw handleApiError(
        error,
        "generateJWT service error; generating access token.",
        500
      );
    }
  }

  async refreshToken(options?: SignOptions) {
    try {
      const refreshToken = this.#token(
        process.env.REFRESH_TOKEN_SECRET!,
        options
      );
      // For verification afterwards.
      await redisClient.sAdd(
        `user:${this.user._id.toString()}:refresh_tokens`,
        refreshToken
      );

      return refreshToken;
    } catch (error: any) {
      throw handleApiError(
        error,
        "generateJWT service error; generating refresh token.",
        500
      );
    }
  }
}

export const isRefreshTokenValid = async (userId: string, token: string) => {
  try {
    return await redisClient.sIsMember(`user:${userId}:refresh_tokens`, token);
  } catch (error: any) {
    throw handleApiError(error, "isRefreshTokenValid service error.", 500);
  }
};

export async function clearSession(userId: string, refreshToken: string) {
  try {
    await redisClient.sRem(`user:${userId}:refresh_tokens`, refreshToken);
  } catch (error: any) {
    throw handleApiError(error, "clearSession service error.", 500);
  }
}

export async function clearAllSessions(userId: string) {
  try {
    await redisClient.del(`user:${userId}:refresh_tokens`);
  } catch (error: any) {
    throw handleApiError(error, "clearAllSessions service error.", 500);
  }
}
