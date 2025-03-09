import { dirname, join } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const SRC_DIRECTORY = process.env.NODE_ENV === "production"
  ? join(_dirname, "../build")
  : join(_dirname, "..");

export default SRC_DIRECTORY;
