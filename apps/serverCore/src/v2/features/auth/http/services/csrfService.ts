import { randomUUID } from "crypto";

import { handleApiError } from "@utils/handleError";
import { redisClient } from "@cache";

export async function generateCsrfToken(userId: string) {
  try {
    const csrfToken = randomUUID();
    await redisClient.sAdd(`user:${userId}:csrf_tokens`, csrfToken);

    return csrfToken;
  } catch (error) {
    throw handleApiError(error, "generateCsrfToken service error.", 500);
  }
}

export async function deleteCsrfToken(userId: string, csrfToken: string) {
  try {
    await redisClient.sRem(`user:${userId}:csrf_tokens`, csrfToken);
  } catch (error) {
    throw handleApiError(error, "deleteCsrfToken service error.", 500);
  }
}

export async function deleteAllCsrfTokens(userId: string) {
  try {
    await redisClient.del(`user:${userId}:csrf_tokens`);
  } catch (error) {
    throw handleApiError(error, "deleteAllCsrfTokens service error.", 500);
  }
}
