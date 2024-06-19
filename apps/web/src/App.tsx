/**
 * Quest Casino Web (front-end)
 * Version: 2.0.0-pre
 *
 * Author: David Bishop
 * Creation Date: April 16, 2024
 * Last Updated: June 19, 2024
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

import { Navigate, type RouteObject } from "react-router-dom";

import HistoryProvider from "@utils/History";
import { ToastsProvider } from "@components/toast";

import { ResourceLoader } from "@components/loaders";
import { Dashboard } from "@components/dashboard";
import { RegisterModal } from "@authFeat/components/modals";
import VerificationHandler from "@components/VerificationHandler";
import { About, Home, Profile, Settings, Support } from "@views/index";
import {
  Error401,
  Error403,
  Error404,
  Error429,
  Error500,
} from "@views/errors";

import "./index.css";

// TODO: Could just make a prop?
const restricted = new Set(["/profile"]);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <HistoryProvider />
        <ToastsProvider />

        <ResourceLoader>
          <Dashboard />
        </ResourceLoader>
        <RegisterModal />
        <VerificationHandler />
      </>
    ),
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
            path: "",
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
        path: "error-401",
        element: <Error401 />,
      },
      {
        path: "error-403",
        element: <Error403 />,
      },
      {
        path: "error-404",
        element: <Error404 />,
      },
      {
        path: "error-429",
        element: <Error429 />,
      },
      {
        path: "error-500",
        element: <Error500 />,
      },
      {
        ...(typeof window !== "undefined" && {
          path: "*",
          element: <Navigate to="/error-404" replace />,
        }),
      },
    ],
  },
];
