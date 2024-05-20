import React from "react";
import { createMemoryRouter } from "react-router-dom";

import registerAction from "../src/features/auth/actions/register";

export default function mockRouter(Story: any) {
  return createMemoryRouter(
    [
      {
        path: "*",
        element: <Story />,
      },
      {
        path: "/action",
        children: [
          {
            path: "register",
            action: registerAction,
          },
        ],
      },
    ],
    {
      initialEntries: ["/"],
    }
  );
}
