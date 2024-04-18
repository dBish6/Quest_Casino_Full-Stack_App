// import postcssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import postcssCustomMedia from "postcss-custom-media";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import cssnano from "cssnano";

export default {
  plugins: [
    // postcssImport({
    //   // root: "./src"
    //   path: "./src/**",
    // }),
    postcssPresetEnv({
      stage: 3,
      features: {
        "nesting-rules": true,
        "custom-properties": true,
      },
      autoprefixer: { grid: true },
    }),
    postcssCustomMedia(),
    postcssFlexbugsFixes(),
    cssnano({
      preset: "default",
    }),
  ],
};
