/**
 * Quest Casino Web (front-end)
 * Version: 2.0.0-pre
 *
 * Author: David Bishop
 * Creation Date: April 16, 2024
 * Last Updated: April 29, 2024
 *
 * Description:
 * .
 *
 * Features:
 *  -
 *
 * Change Log (Not yet, when it's released it would be):
 * The log is in the changelog.txt file at the base of this web directory.
 */

import { type RouteObject } from "react-router-dom";

import { Dashboard } from "@components/partials";
import { About, Home, Profile, Settings, Support } from "@views/index";
import { Error404, Error500 } from "@views/errors";

import registerAction from "@authFeat/actions/register";

import "./index.css";

const restricted = new Set(["/profile"]);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        index: true,
        path: "about",
        element: <About />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "/profile",
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "/error-404",
        element: <Error404 />,
      },
      {
        path: "/error-500",
        element: <Error500 />,
      },
    ],
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
];
