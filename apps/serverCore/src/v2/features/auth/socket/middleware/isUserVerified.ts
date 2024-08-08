import type { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";

import { getUser } from "@authFeat/services/authService";

/**
 * The user is required to be verified to establish a connection to a socket instance. Just checks if they're verified 
 * before connection event.
 * @middleware Socket middleware.
 * @payload `unauthorized`, `ApiError`, or `SocketError`.
 */
export default async function isUserVerified(socket: Socket, next: (err?: ExtendedError) => void) {
  if (socket.request._query.sid !== undefined) return next();

  try {
    const user = await getUser("_id", socket.decodedClaims?.sub!);
    if (!user?.email_verified)
      return next(new Error("verification required"));

    next();
  } catch (error: any) {
    next(error);
  }
}
