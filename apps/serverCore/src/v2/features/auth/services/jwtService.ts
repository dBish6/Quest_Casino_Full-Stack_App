/**
 * JWT Service
 *
 * Description:
 * Handles functionally of the user's access and refresh tokens.
 */

import type { UserToClaims, UserClaims } from "@authFeat/typings/User";

import jwt from "jsonwebtoken";

import { logger } from "@qc/utils";
import { handleApiError } from "@utils/handleError";
import { redisClient } from "@cache";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export class GenerateUserJWT {
  private user: UserToClaims;

  constructor(user: UserToClaims) {
    this.user = user;
  }

  accessToken(options?: jwt.SignOptions) {
    try {
      return this.#token(ACCESS_TOKEN_SECRET!, options);
    } catch (error: any) {
      throw handleApiError(
        error,
        "generateJWT service error; generating access token.",
        500
      );
    }
  }

  async refreshToken(options?: jwt.SignOptions) {
    try {
      const refreshToken = this.#token(REFRESH_TOKEN_SECRET!, options);
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

  #token(secret: jwt.Secret, options?: jwt.SignOptions) {
    return jwt.sign({ sub: this.user._id.toString(), ...this.user }, secret, {
      algorithm: "HS256",
      expiresIn: "15m",
      ...options,
    });
  }
}

export class JWTVerification {
  public refreshThreshold: number;

  constructor(refreshThreshold: number = 1000 * 60 * 3) {
    this.refreshThreshold = refreshThreshold;
  }

  /**
   * Verifies the user's access and refresh tokens. If the access token is missing, it attempts to verify the refresh token.
   */
  async verifyUserToken(accessToken: string | undefined, refreshToken: string | undefined) {
    if (!accessToken) {
      logger.debug("Access token missing trying to refresh...")
      if (refreshToken) {
        return this.verifyRefreshToken(refreshToken);
      }

      return { claims: null, message: "Access token is missing." };
    }

    return this.verifyAccessToken(accessToken, refreshToken);
  }

  /**
   * Verifies the access token. Checks its validity and if it's within the refresh threshold or expired, it then checks the refresh token for validity.
   */
  async verifyAccessToken(accessToken: string | undefined = "", refreshToken: string | undefined = "") {
    try {
      const decodedClaims = this.#verifyJwt<UserClaims>(
        accessToken,
        ACCESS_TOKEN_SECRET!
      );
      // logger.debug("Access token decodedClaims:", decodedClaims);

      const tokenExpiry = decodedClaims.exp! * 1000,
        currentTime = Date.now();
      // Signifies to refresh when within the refresh threshold.
      if (tokenExpiry - currentTime <= this.refreshThreshold) {
        const match = await this.#isRefreshTokenMatching(
          decodedClaims.sub,
          refreshToken
        );
        if (!match) return { claims: null, message: "Refresh token disparity." };

        return { claims: decodedClaims, message: "Within refresh threshold." };
      } else if (tokenExpiry <= currentTime) {
        return { claims: decodedClaims, message: "Access token is expired." };
      }

      return { claims: decodedClaims, message: "Is valid." };
    } catch (error: any) {
      if (this.#isJwtError(error)) 
        return { claims: null, message: "Access token is invalid." };

      throw handleApiError(
        error,
        "JWTVerification service error; access token verification.",
        500
      );
    }
  }

  /**
   * Verifies the refresh token. Checks its validity and matches it against the cache.
   */
  async verifyRefreshToken(refreshToken: string | undefined = "") {
    try {
      const decodedClaims = this.#verifyJwt<UserClaims>(
        refreshToken,
        REFRESH_TOKEN_SECRET!
      );
      // logger.debug("Refresh token decodedClaims:", decodedClaims);

      const match = await this.#isRefreshTokenMatching(
        decodedClaims.sub,
        refreshToken
      );
      if (!match) return { claims: null, message: "Refresh token disparity." };

      return { claims: decodedClaims, message: "Is valid." };
    } catch (error: any) {
      if (this.#isJwtError(error)) 
        return { claims: null, message: "Refresh token is invalid." };
      
      throw handleApiError(
        error,
        "JWTVerification service error; refresh token verification.",
        500
      );
    }
  }

  /**
   * Verifies the integrity of a JWT and returns the given claims type.
   */
  #verifyJwt<TClaims = jwt.JwtPayload>(
    token: string,
    secretOrPublicKey: jwt.Secret,
    VerifyOptions?: jwt.VerifyOptions
  ) {
    return jwt.verify(token, secretOrPublicKey, { ignoreExpiration: true, ...VerifyOptions }) as TClaims;
  }

  /**
   * Checks if the provided refresh token matches the cache for the given user.
   */
  async #isRefreshTokenMatching(userId: string, token: string) {
    return await redisClient.sIsMember(`user:${userId}:refresh_tokens`, token);
  }

  #isJwtError(err: any) {
    return err instanceof jwt.JsonWebTokenError || err instanceof jwt.NotBeforeError;
  }
}

/**
 * Removes a specific refresh token from a user in the cache.
 */
export async function clearSession(userId: string, refreshToken: string) {
  try {
    await redisClient.sRem(`user:${userId}:refresh_tokens`, refreshToken);
  } catch (error: any) {
    throw handleApiError(error, "clearSession service error.", 500);
  }
}

/**
 * Removes all refresh tokens in the cache from the given user.
 */
export async function clearAllSessions(userId: string) {
  try {
    await redisClient.del(`user:${userId}:refresh_tokens`);
  } catch (error: any) {
    throw handleApiError(error, "clearAllSessions service error.", 500);
  }
}
