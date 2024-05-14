import type { Request, Response, NextFunction } from "express";
import type { Secret } from "jsonwebtoken";
import type { UserClaims } from "@authFeat/typings/User";

import jwt from "jsonwebtoken";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";

import REFRESH_THRESHOLD from "@authFeat/constants/REFRESH_THRESHOLD";

import { isRefreshTokenValid } from "@authFeat/services/jwtService";
import initializeSession from "@authFeat/utils/initializeSession";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

/**
 * @middleware
 * Verifies the access token and also refreshes the session if needed.
 *
 * This should only be used on routes where the user should already be logged in for.
 */
export default async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { session: accessToken, refresh: refreshToken } = req.cookies;
  // console.log("accessToken", accessToken);
  try {
    if (!accessToken) {
      // Refreshes if there is no accessToken anymore but there is a refreshToken, which indicates that the accessToken has expired.
      if (refreshToken) {
        const decodedClaims = await verifyJwt<UserClaims>(
          refreshToken,
          REFRESH_TOKEN_SECRET!
        );
        // console.log("decodedClaims", decodedClaims);
        if (!decodedClaims)
          return res.status(403).json({
            message: "Refresh token is invalid.",
          });

        const errorMsg = await refreshSession(
          req,
          res,
          decodedClaims,
          refreshToken
        );
        if (errorMsg) {
          return res.status(401).json({
            message: errorMsg,
          });
        }

        next();
      }
      return res.status(401).json({
        message: "Access token is missing.",
      });
    }

    const decodedClaims = await verifyJwt<UserClaims>(
      accessToken,
      ACCESS_TOKEN_SECRET!
    );
    // console.log("decodedClaims", decodedClaims);
    if (!decodedClaims)
      return res.status(403).json({
        message: "Access token is invalid.",
      });

    const tokenExpiry = decodedClaims.exp! * 1000,
      currentTime = Date.now();

    // Refreshes if the token expiry is within the refresh threshold.
    if (tokenExpiry - currentTime <= REFRESH_THRESHOLD) {
      const errorMsg = await refreshSession(
        req,
        res,
        decodedClaims,
        refreshToken
      );
      if (errorMsg) {
        return res.status(401).json({
          message: errorMsg,
        });
      }

      next();
    } else if (tokenExpiry <= currentTime) {
      return res.status(403).json({
        message: "Access token is expired.",
      });
    }

    req.decodedClaims = decodedClaims;
    logger.info("Access token successfully verified.");
    next();
  } catch (error) {
    next(createApiError(error, "verifyAccessToken middleware error.", 500));
  }
}

async function verifyJwt<T>(token: string, secretOrPublicKey: Secret) {
  try {
    return jwt.verify(token, secretOrPublicKey) as T;
  } catch (error) {
    return false;
  }
}

async function refreshSession(
  req: Request,
  res: Response,
  user: UserClaims,
  refreshToken: string
) {
  try {
    const isTokenValid = await isRefreshTokenValid(user.sub, refreshToken);
    if (!isTokenValid) return "Refresh token was not found.";

    await initializeSession(res, user.sub);

    req.decodedClaims = user;
    logger.info("Session was refreshed successfully verified.");
  } catch (error) {
    throw error;
  }
}
