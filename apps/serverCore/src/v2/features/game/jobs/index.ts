import type { JobOptions } from "bree";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

/** Predefined jobs. */
export const gameJobs: JobOptions[] = [
  // FIXME: Broken in dev because of Typescript.
  // {
  //   name: "rotate-quests-and-bonuses",
  //   path: join(_dirname, "rotateQuestsAndBonuses", "rotateQuestsAndBonuses.ts"),
  //   interval: "14d",
  //   // timeout: 0
  // }
];
