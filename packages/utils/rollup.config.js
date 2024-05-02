import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/logger.ts",
  output: {
    file: "build/bundle.js",
    format: "cjs",
    name: "utils",
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      declaration: true,
    }),
    terser(),
  ],
};
