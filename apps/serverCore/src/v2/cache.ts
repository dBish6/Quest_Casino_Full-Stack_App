/**
 * Redis Setup
 */

import { createClient } from "redis";

export const redisClient = createClient({
  url:
    process.env.NODE_ENV === "production"
      ? `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`
      : `redis://${process.env.REDIS_HOST}:6379`,
});

redisClient.on("connect", () => {
  console.log("Redis server is successfully running!");
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
      console.log(error);

      retries -= 1;
      if (retries === 0)
        throw Error("Redis failed to connect, shutting down server...");
      console.log(
        `Redis connection failed. Retrying connection; ${retries} retries left.`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// TODO: Make a function that fires every day and does a redisClient.memoryUsage.
