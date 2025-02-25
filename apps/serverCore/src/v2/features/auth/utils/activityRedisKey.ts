import type { ObjectId } from "mongoose";

export const KEY = (userId: ObjectId | string) => ({
  status: `user:${userId.toString()}:activity:status`,
  inactivityTimestamp: `user:${userId.toString()}:activity:inactivity_timestamp`
});
