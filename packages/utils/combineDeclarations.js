import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { resolve } from "path";

const buildDir = resolve("./build"),
  outputFile = resolve(buildDir, "bundle.d.ts");

const files = readdirSync(buildDir).filter(
  (file) => file.endsWith(".d.ts") && file !== "bundle.d.ts"
);

let combined = "";
for (const file of files) {
  const filePath = resolve(buildDir, file);
  const fileContent = readFileSync(filePath, "utf-8");
  combined += fileContent + "\n";

  unlinkSync(filePath);
}

writeFileSync(outputFile, combined);
