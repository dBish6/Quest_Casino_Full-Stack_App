/**
 * Redis Setup
 */

import { createClient } from "redis";
import { logger } from "@qc/utils";

export const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on("connect", () => {
  logger.info("Redis server is successfully running!");
});

redisClient.on("error", (error) => {
  if (error.code === "ECONNREFUSED") {
    throw new Error("Redis connection error:\n" + error.message);
  } else {
    throw new Error("Redis error:\n" + error.message);
  }
});

export default async function establishRedisConnection() {
  let retries = 5;

  while (retries) {
    try {
      await redisClient.connect();
      break;
    } catch (error) {
      logger.error(error);

      retries -= 1;
      if (retries === 0) throw new Error("Redis failed to connect, shutting down server...");
      
      logger.debug(`Redis connection failed. Retrying connection; ${retries} retries left.`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// TODO: Make a function that fires every day and does a redisClient.memoryUsage?
