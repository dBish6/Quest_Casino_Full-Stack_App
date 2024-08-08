import { randomUUID } from "crypto";

import { handleHttpError } from "@utils/handleError";
import { redisClient } from "@cache";

/**
 * Generates a CSRF token for the specified user and stores it in the cache.
 */
export async function generateCsrfToken(userId: string) {
  try {
    const csrfToken = randomUUID();
    await redisClient.sAdd(`user:${userId}:csrf_tokens`, csrfToken);

    return csrfToken;
  } catch (error: any) {
    throw handleHttpError(error, "generateCsrfToken service error.", 500);
  }
}

/**
 * Deletes a specific CSRF token for the specified user from the cache.
 */
export async function deleteCsrfToken(userId: string, csrfToken: string) {
  try {
    await redisClient.sRem(`user:${userId}:csrf_tokens`, csrfToken);
  } catch (error: any) {
    throw handleHttpError(error, "deleteCsrfToken service error.", 500);
  }
}

/**
 * Deletes all CSRF tokens in the cache from the given user.
 */
export async function deleteAllCsrfTokens(userId: string) {
  try {
    await redisClient.del(`user:${userId}:csrf_tokens`);
  } catch (error: any) {
    throw handleHttpError(error, "deleteAllCsrfTokens service error.", 500);
  }
}
