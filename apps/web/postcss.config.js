import postcssImport from "postcss-import";
import postcssMixins from "postcss-mixins";
import postcssPresetEnv from "postcss-preset-env";
import postcssCustomMedia from "postcss-custom-media";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import cssnano from "cssnano";

export default {
  plugins: [
    postcssImport(),
    postcssMixins(),
    postcssPresetEnv({
      stage: 3,
      features: {
        "nesting-rules": true,
        "custom-properties": true
      },
      autoprefixer: { grid: true }
    }),
    postcssCustomMedia(),
    postcssFlexbugsFixes(),
    cssnano({ preset: "default" })
  ]
};
