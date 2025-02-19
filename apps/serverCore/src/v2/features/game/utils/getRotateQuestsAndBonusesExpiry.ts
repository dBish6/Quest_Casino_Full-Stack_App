import { logger } from "@qc/utils";
import { handleApiError } from "@utils/handleError";

import { redisClient } from "@cache";

import { KEY, EXPIRY_BUFFER } from "@gameFeat/jobs/rotateQuestsAndBonuses";

export default async function getRotateQuestsOrBonusesExpiry(type: "quests" | "bonuses") {
  try {
    const ttl = await redisClient.ttl(KEY(type)); // Doesn't matter, quests and bonuses has the same expiry.

    if (ttl < 0) {
      logger.error(
        `getRotateQuestsAndBonusesExpiry error:\nRedis key ${KEY(type)} doesn't have an expiration set, defaulting back to in 14 days.`
      );
      return new Date(Date.now() + 60 * 60 * 24 * 14 * 1000).toISOString();
    }

    const timestamp = Date.now() + (ttl - EXPIRY_BUFFER) * 1000;

    return new Date(timestamp).toISOString();
  } catch (error: any) {
    throw handleApiError(error, "getRotateQuestsAndBonusesExpiry error.");
  }
}
