import type { Request, Response, NextFunction } from "express";

import { logger } from "@qc/utils";
import { handleApiError } from "@utils/handleError";

import { JWTVerification } from "@authFeat/services/jwtService";
import initializeSession from "@authFeatHttp/utils/initializeSession";

/**
 * Verifies the access and refresh tokens and also refreshes the session if needed.
 * @middleware This should only be used on routes where the user should already be logged in for.
 * @response `unauthorized`, `forbidden`, or `ApiError`.
 */
export default async function verifyUserToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies?.session,
    refreshToken = req.cookies?.refresh;

  const jwtVerification = new JWTVerification();

  try {
    const result = await jwtVerification.verifyUserToken(accessToken, refreshToken);
    if (!result.claims) 
      return res.status(["missing", "disparity"].includes(result.message, -1) ? 401 : 403).json({
        ERROR: result.message,
      });
    
    // Refreshes the session when within the refresh threshold or expired.
    if (["threshold", "expired"].includes(result.message)) {
      logger.debug("Within refresh threshold or expired", result.message);

      const refreshResult = await initializeSession(
        res,
        { by: "_id", value: result.claims.sub },
        req.headers["x-xsrf-token"] as string,
      );
      if (typeof refreshResult === "string") return res.status(401).json({ ERROR: result.message });
      logger.info("Session refresh was attached to the response.");
    }

    req.decodedClaims = result.claims;
    logger.info("Access token successfully verified.");
    next();
  } catch (error) {
    next(handleApiError(error, "http/verifyAccessToken middleware error.", 500));
  }
}
