import { parentPort, workerData } from "worker_threads";

import { logger } from "@qc/utils";

import { updateUserCredentials } from "@authFeat/services/authService";

// FIXME: Broken in dev because of Typescript.
(async () => {
  try {
    const { userId } = workerData;
    console.log(`scheduleUnlockUser unlocking user: ${userId}`);

    await updateUserCredentials(
      { by: "_id", value: userId },
      { $unset: { locked: "" } }
    );

    logger.info(`User ${userId} unlocked successfully!`);
    parentPort?.postMessage("done");
  } catch (error) {
    logger.error("scheduleUnlockUser job error:\n", error);
    parentPort?.postMessage("error");
  }
})();
