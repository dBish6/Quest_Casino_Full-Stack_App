import { SocketError } from "@utils/handleError";
import { redisClient } from "@cache";

/**
 * Retrieves the auth namespace socket ID for a connected user.
 * @throws `SocketError not found` only when the `isCurrentUser` parameter is true.
 */
export default async function getSocketId(memberId: string, isCurrentUser?: boolean) {
  const socketId = await redisClient.get(`user:${memberId}:socket_id`);
  if (isCurrentUser && !socketId)
    throw new SocketError("Unexpectedly couldn't find a user's socket id after connection.", "not found");

  return socketId;
}
