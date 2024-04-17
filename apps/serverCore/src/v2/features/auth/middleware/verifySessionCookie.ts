import { Request, Response, NextFunction } from "express";
import { auth } from "@model/firebase";

/**
 * Verifies the user's session cookie; this middleware should be used on routes where the user should already be logged in.
 */
export default async function verifySessionCookie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionCookie = req.cookies.session;
    if (!sessionCookie)
      return res.status(401).json({
        message: "Session cookie is missing.",
      });

    await auth.verifySessionCookie(sessionCookie);

    console.log("Session cookie successfully verified.");
    next();
  } catch (error: any) {
    return res.status(403).clearCookie("session").json({
      ERROR: "Invalid or missing session cookie.",
    });
  }
}
