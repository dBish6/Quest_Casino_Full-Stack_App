import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import { createApiError } from "@utils/CustomError";
import { redisClient } from "@cache";

/**
 * Verifies the Cross-Site Request Forgery (CSRF) token
 * @middleware This should be used on routes that manipulate data (e.g. POST, PATCH, PUT, DELETE).
 */
export default async function verifyCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cachedTokens = await redisClient.sMembers(
        `user:${req.decodedClaims!.sub}:csrf_tokens`
      ),
      receivedToken = req.headers["x-xsrf-token"];

    if (!cachedTokens || !receivedToken)
      return res.status(403).json({
        ERROR: "CSRF token is missing.",
      });

    const match = cachedTokens.some((token) =>
      compare(token, receivedToken as string)
    );
    if (!match)
      return res.status(403).json({
        ERROR: "CSRF token does not match.",
      });

    console.log("Csrf token successfully verified.");
    next();
  } catch (error: any) {
    next(
      createApiError(error, "verifyCsrfToken middleware unexpected error.", 500)
    );
  }
}
