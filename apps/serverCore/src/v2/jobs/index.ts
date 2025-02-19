import Bree from "bree";

import { authJobs } from "@authFeat/jobs";
import { gameJobs } from "@gameFeat/jobs";

const bree = new Bree({
  root: false,
  jobs: [...authJobs, ...gameJobs]
});

export default bree;
