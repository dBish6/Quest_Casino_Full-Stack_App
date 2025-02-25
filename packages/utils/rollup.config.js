import multi from "@rollup/plugin-multi-entry";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/**/*.ts",
  output: {
    file: "build/bundle.js",
    format: "es"
  },
  plugins: [
    multi(),
    resolve(),
    typescript({ declaration: true }),
    terser()
  ]
};
