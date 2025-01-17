import { dirname, join } from "path";
import { fileURLToPath } from "url";

const SRC_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), "..");
export default SRC_DIRECTORY;
