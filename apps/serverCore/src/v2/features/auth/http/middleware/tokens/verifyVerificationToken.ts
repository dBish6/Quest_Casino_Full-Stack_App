import type { Request, Response, NextFunction } from "express";

import { logger } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";

import { JWTVerification } from "@authFeat/services/jwtService";

/**
 * Verifies a verification token.
 * @middleware
 * @response `unauthorized`, `forbidden`, or `ApiError`.
 */
export default async function verifyVerificationToken(
  req: Request<{}, {}, { verification_token?: string }>,
  res: Response,
  next: NextFunction
) {
  const { verification_token } = req.body,
    jwtVerification = new JWTVerification();

  try {
    const decodedClaims = await jwtVerification.verifyVerificationToken(verification_token);

    if (req.originalUrl.includes("/reset-password")) {
      req.verDecodedClaims = decodedClaims;
      res.on("finish", () => {
        logger.debug("req.verDecodedClaims Deleted");
        delete req.verDecodedClaims; // Deletes after response is sent.
      });
    }
    logger.debug("Verification token successfully verified.");
    next();
  } catch (error: any) {
    next(handleHttpError(error, "verifyVerificationToken middleware error."));
  }
}
