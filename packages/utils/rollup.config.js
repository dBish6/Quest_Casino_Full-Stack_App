import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/logger.ts",
  output: {
    file: "build/bundle.js",
    format: "es",
    name: "utils",
  },
  plugins: [
    resolve(),
    typescript({
      declaration: true,
    }),
    terser(),
  ],
};
