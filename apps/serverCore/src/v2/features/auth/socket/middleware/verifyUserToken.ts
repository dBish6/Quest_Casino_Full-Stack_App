import type { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";

import { logger } from "@qc/utils";

import { JWTVerification } from "@authFeat/services/jwtService";

/**
 * Verifies the access and refresh tokens only on the initial handshake. This middleware doesn't refresh the session like the http token verify
 * middleware, we just need the decodedClaims.
 * @middleware Socket middleware.
 * @response `unauthorized`, `forbidden`, or `base socket error`.
 */
export default async function verifyUserToken(socket: Socket, next: (err?: ExtendedError) => void) {
  const req = socket.request,
   isHandshake = req._query.sid === undefined;

  if (!isHandshake) return next();

  const accessToken = req.cookies?.session,
    refreshToken = req.cookies?.refresh;

  const jwtVerification = new JWTVerification();

  try {
    let result = await jwtVerification.verifyUserToken(accessToken, refreshToken);
    if (!result.claims)
      return new Error(["missing", "disparity"].includes(result.message, -1) ? "unauthorized" : "forbidden")

    req.decodedClaims = result.claims; // Attaches to socket.request.
    logger.info("Access token successfully verified.");
    next();
  } catch (error: any) {
    console.error("THAT ERROR: ", error);
    next(error)
  }
}
