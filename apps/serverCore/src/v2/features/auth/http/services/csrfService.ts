import type { ObjectId } from "mongoose";

import { randomUUID } from "crypto";

import { handleHttpError } from "@utils/handleError";
import { redisClient } from "@cache";

export const KEY = (userId: ObjectId | string) => `user:${userId.toString()}:csrf_tokens`;

/**
 * Generates a CSRF token for the specified user and stores it in the cache.
 */
export async function generateCsrfToken(userId: ObjectId | string) {
  try {
    const csrfToken = randomUUID();
    await redisClient.sAdd(KEY(userId), csrfToken);

    return csrfToken;
  } catch (error: any) {
    throw handleHttpError(error, "generateCsrfToken service error.", 500);
  }
}

/**
 * Deletes a specific CSRF token for the specified user from the cache.
 */
export async function deleteCsrfToken(userId: ObjectId | string, csrfToken: string) {
  try {
    await redisClient.sRem(KEY(userId), csrfToken);
  } catch (error: any) {
    throw handleHttpError(error, "deleteCsrfToken service error.", 500);
  }
}

/**
 * Deletes all CSRF tokens in the cache from the given user.
 */
export async function deleteAllCsrfTokens(userId: ObjectId | string) {
  try {
    await redisClient.del(KEY(userId));
  } catch (error: any) {
    throw handleHttpError(error, "deleteAllCsrfTokens service error.", 500);
  }
}
