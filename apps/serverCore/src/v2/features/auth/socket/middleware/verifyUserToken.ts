import type { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";

import { logger } from "@qc/utils";

import { JWTVerification } from "@authFeat/services/jwtService";

/**
 * Verifies the access and refresh tokens only on the initial handshake. This middleware doesn't refresh the session like the http token verify
 * middleware. The decoded claims are also attached to the socket and lasts the duration of the connection.
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
      return next(new Error(["missing", "disparity"].includes(result.message, -1) ? "unauthorized" : "forbidden"))

    socket.decodedClaims = result.claims;
    logger.info("Socket Access token successfully verified."); // I hate this comment.
    next();
  } catch (error: any) {
    next(error)
  }
}
