import { Request, Response, NextFunction } from "express";
import { auth } from "@model/firebase";

/**
 * Verifies the user's ID token before the login; this middleware is exclusively for the login.
 */
export default async function verifyUserIdToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "User ID token is missing.",
    });
  } else if (!authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Found the authorization header, but isn't a Bearer token.",
    });
  }

  try {
    const jwt = authHeader.split(" ")[1],
      decodedClaims = await auth.verifyIdToken(jwt);

    // We know the token is compromised if the token creation time is greater than 3 minutes ago.
    if (new Date().getTime() / 1000 - decodedClaims.auth_time > 3 * 60) {
      return res.status(401).json({
        message: "User authentication has expired.",
      });
    }

    req.userIdToken = jwt;
    req.decodedClaims = decodedClaims;

    console.log("User ID token successfully verified.");
    next();
  } catch (error) {
    return res.status(403).json({
      ERROR: "User ID token is invalid.",
    });
  }
}
