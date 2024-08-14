import { redisClient } from "@cache";
import { logger } from "@qc/utils";

export type LockKey = "archive_messages";

/**
 * A distributed lock class for managing concurrent access to resources across multiple connections.
 * - Helps to prevent race conditions since node lacks concurrency due to it's single thread.
 */
export default class Lock {
  readonly LOCK_KEY: string;
  readonly LOCK_EXPIRE_TIME: number;

  constructor(lockKey: LockKey, expiry = 60 * 5) {
    this.LOCK_KEY = `lock:${lockKey}`;
    this.LOCK_EXPIRE_TIME = expiry;
  }

  async acquireLock(): Promise<boolean> {
    try {
      const result = await redisClient.set(this.LOCK_KEY, "locked", {
        NX: true, // Ensures that the lock is only set once.
        EX: this.LOCK_EXPIRE_TIME,
      });
      if (result !== "OK")
        logger.debug(`Lock with key ${this.LOCK_KEY} is already locked by another connection.`);

      return result === "OK";
    } catch (error: any) {
      throw new Error("Failed to acquire Redis lock:\n" + error.message);
    }
  }

  async releaseLock() {
    try {
      await redisClient.del(this.LOCK_KEY);
    } catch (error: any) {
      throw new Error("Failed to release Redis lock:\n" + error.message);
    }
  }

  async withLock(callback: () => Promise<void>) {
    const acquired  = await this.acquireLock();
    if (acquired) {
      try {
        await callback();
      } catch (error) {
        throw error;
      } finally {
        await this.releaseLock();
      }
    }
  }
}
