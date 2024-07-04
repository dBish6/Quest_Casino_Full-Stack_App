/**
 * Quest Casino Web (front-end)
 * Version: 2.0.0-pre
 *
 * Author: David Bishop
 * Creation Date: April 16, 2024
 * Last Updated: July 3, 2024
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
import { Error } from "@views/errors";

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

          <RegisterModal />
          <VerificationHandler />
        </ResourceLoader>
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
        element: (
          <Error
            status={401}
            title="Unauthorized"
            description="User authorization is required."
          />
        ),
      },
      {
        path: "error-403",
        element: (
          <Error
            status={403}
            title="Forbidden"
            description="User authorization or CSRF token is not valid."
          />
        ),
      },
      {
        path: "error-404",
        element: (
          <Error status={404} title="Not Found" description="Page not found." />
        ),
      },
      {
        path: "error-429",
        element: (
          <Error
            status={429}
            title="Too Many Requests"
            description="Too many requests have been made to the server, the entire site maybe on lockdown for you. You can try refreshing to the home page, but if this persists, come back in an hour."
          />
        ),
      },
      {
        path: "error-500",
        element: (
          <Error
            status={500}
            title="Internal Server Error"
            description="Unexpected server error or couldn't establish a connection."
          />
        ),
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
