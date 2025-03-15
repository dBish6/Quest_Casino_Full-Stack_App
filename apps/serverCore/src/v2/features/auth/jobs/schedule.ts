import type { ObjectId } from "mongoose";
import type { JobOptions } from "bree";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import bree from "@jobs/index"

export async function scheduleUnlockUser(userId: string | ObjectId, at: JobOptions["timeout"]) {
  const id = userId.toString();
 
  await bree.add({
    name: `unlock-user-${id}`,
    path: join(dirname(fileURLToPath(import.meta.url)), "unlockUser.ts"),
    timeout: at, // Delay until.
    worker: { workerData: { userId: id } }
  });
}
