import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from "rollup-plugin-auto-external";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
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
    copy({
      targets: [
        {
          src: "src/v2/features/auth/http/emails/templates/**/*",
          dest: "build/features/auth/http/emails/templates",
          rename: (_, _, fullPath) =>
            fullPath.replace(/^src\/v2\/features\/auth\/http\/emails\/templates\//, "")
        },
        {
          src: "src/v2/emails/partials/**/*",
          dest: "build/emails/partials"
        }
      ],
      copyOnce: true
    }),    
    visualizer()
  ]
};
