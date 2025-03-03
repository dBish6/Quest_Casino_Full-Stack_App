import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from "rollup-plugin-auto-external";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

export default {
  input: "src/v2/index.ts",
  output: {
    file: "build/bundle.mjs",
    format: "es",
    // sourcemap: true,
    compact: true
  },
  external: ["aws-sdk", "mock-aws-s3", "nock"],
  plugins: [
    typescript({ exclude: ["**/*.old*", "**/*copy*"] }),
    json(),
    resolve(),
    commonjs(),
    autoExternal(),
    terser(),
    visualizer()
  ]
};
