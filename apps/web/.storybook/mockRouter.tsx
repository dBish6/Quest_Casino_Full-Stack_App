import React from "react";
import { createMemoryRouter } from "react-router-dom";

export default function mockRouter(Story: any) {
  return createMemoryRouter(
    [
      {
        path: "*",
        element: <Story />,
      },
    ],
    {
      initialEntries: ["/"],
    }
  );
}
