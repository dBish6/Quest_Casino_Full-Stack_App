import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "Dashboard",
      values: [{ name: "Dashboard", value: "#19142E" }],
    },
  },
};

export default preview;
