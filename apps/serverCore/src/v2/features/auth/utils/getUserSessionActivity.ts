import type { ObjectId } from "mongoose";
import type { ActivityStatuses } from "@qc/typescript/typings/UserCredentials";

import { KEY } from "@authFeat/socket/services/SocketAuthService";
import { redisClient } from "@cache";

export default async function getUserSessionActivity(userId: ObjectId | string) {
  const [activityStatus, inactivityTimestamp] = await Promise.all([
    redisClient.get(KEY(userId).status),
    redisClient.get(KEY(userId).inactivityTimestamp)
  ]);

  return {
    status: (activityStatus || "offline") as ActivityStatuses,
    ...(inactivityTimestamp && {
      inactivity_timestamp: inactivityTimestamp
    })
  };
}
