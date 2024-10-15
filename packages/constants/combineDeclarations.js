import { resolve } from "path";
import { unlinkSync, readdirSync, statSync, rmdirSync, readFileSync, existsSync, writeFileSync } from "fs";

const buildDir = resolve("./build"),
  outputFile = resolve(buildDir, "bundle.d.ts");

if (existsSync(outputFile)) unlinkSync(outputFile)

const filePaths = [],
  directoryPaths = [];
for (const file of readdirSync(buildDir)) {
  const path = resolve(buildDir, file);
  if (file.endsWith(".d.ts")) {
    filePaths.push(path);
  } else if (statSync(path).isDirectory()) {
    directoryPaths.push(path);

    readdirSync(path).forEach((file) => {
      if (file.endsWith(".d.ts")) filePaths.push(resolve(path, file));
    });
  }
}

let fileContent = "";
for (const filePath of filePaths) {
  fileContent += readFileSync(filePath, "utf-8");
  unlinkSync(filePath);
}
if (directoryPaths.length) directoryPaths.forEach((dir) => rmdirSync(dir));

writeFileSync(outputFile, fileContent);
