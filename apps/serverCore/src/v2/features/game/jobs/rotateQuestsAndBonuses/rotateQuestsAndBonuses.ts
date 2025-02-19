import { parentPort } from "worker_threads";
import { logger } from "@qc/utils";

import rotateQuestsAndBonuses from ".";

(async () => {
  try {
    rotateQuestsAndBonuses();

    logger.info("Quests and bonuses successfully rotated!");
    parentPort?.postMessage("done");
  } catch (error) {
    logger.error("rotateQuestsAndBonuses job error:\n", error);
    parentPort?.postMessage("error");
  }
})();
