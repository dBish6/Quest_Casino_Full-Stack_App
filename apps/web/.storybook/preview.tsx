import type { Preview } from "@storybook/react";

import React from "react";
import { RouterProvider } from "react-router-dom";
import mockRouter from "./mockRouter";

import { Provider } from "react-redux";
import mockStore from "./mockStore";

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
  decorators: [
    (Story) => {
      const router = mockRouter(Story);

      return (
        <Provider store={mockStore}>
          <RouterProvider router={router} fallbackElement={<Story />} />
        </Provider>
      );
    },
  ],
};

export default preview;
