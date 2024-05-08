import type { Request, Response, NextFunction } from "express";

// import { deleteCsrfToken } from "@csrfFeat/services/csrfService";

/**
 * Clears the session and csrf tokens.
 */
// function clearTokens(res: Response) {
//   deleteCsrfToken()
//   res.clearCookie("session")
// }

/**
 * Verifies the user's session cookie; this middleware should be used on routes where the user should already be logged in.
 */
export default async function verifySessionCookie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionCookie = req.cookies?.session;
    if (!sessionCookie)
      return res.status(401).json({
        message: "Session cookie is missing.",
      });

    // TODO: If you can't figure out if this verify fails if it is expired or not. Use the csrf token
    // as the way to figure out when a new session stops or starts or use some other way to check if the cookie is expired.
    // const decodedClaims = await auth.verifySessionCookie(sessionCookie);

    // if (req.decodedClaims !== decodedClaims)
    //   return res.status(403).clearCookie("session").json({
    //     ERROR: "Unexpected change in session cookie.",
    //   });

    console.log("Session cookie successfully verified.");
    next();
  } catch (error: any) {
    return res.status(403).clearCookie("session").json({
      ERROR: "Session cookie is invalid.",
    });
  }
}
