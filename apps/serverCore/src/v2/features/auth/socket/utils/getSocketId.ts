import type { ObjectId } from "mongoose";
import { redisClient } from "@cache";

/**
 * Retrieves the auth namespace socket ID for a connected user.
 * @throws Not Found error.
 */
export default async function getSocketId(userId: ObjectId | string) {
  const socketId = await redisClient.get(`user:${userId.toString()}:socket_id`);
  if (!socketId)
    throw Error("Unexpectedly couldn't find a user's socket id after connection.");

  return socketId;
}
