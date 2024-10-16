/**
 * Quest Casino Web (front-end)
 * Version: 2.0.0-pre
 *
 * Author: David Bishop
 * Creation Date: April 16, 2024
 * Last Updated: Oct 16, 2024
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

import { type RouteObject, Navigate, json } from "react-router-dom";

import store from "@redux/store";
import { apiEndpoints } from "@services/api";

import HistoryProvider from "@utils/History";
import { ToastsProvider } from "@components/toast";

import { ResourceLoaderProvider } from "@components/loaders";
import SocketListenersProvider from "@components/SetupSocketListeners";
import { Dashboard } from "@components/dashboard";
import { ModalsProvider } from "@components/modals";
import VerificationHandler from "@components/VerificationHandler";
import AwayActivityTracker from "@components/AwayActivityTracker";

import { RestrictView, About, Home, Profile, Settings, Support } from "@views/index";
import { Error } from "@views/errors";

import registerAction from "@authFeat/actions/validateRegister";

import "./index.css";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <HistoryProvider />
        <ToastsProvider />

        <ResourceLoaderProvider>
          <SocketListenersProvider />

          <Dashboard />

          <ModalsProvider />
          <VerificationHandler />
          <AwayActivityTracker />
        </ResourceLoaderProvider>

        <Navigate to="/home" replace />
      </>
    ),
    children: [
      {
        index: true,
        path: "about",
        element: <About />
      },
      {
        path: "home",
        element: <Home />,
        shouldRevalidate: () => false,
        loader: async () => {
          const res = store.dispatch(apiEndpoints.getCarouselContent.initiate());

          try {
            const data = await res.unwrap();
            return data;
          } catch (error: any) {
            if (error.data) return error;
            else return json(
              { ERROR: error.message || "An unexpected error occurred in the carousel loader." },
              { status: 500 }
            );
          } finally {
            res.unsubscribe()
          }
        }
      },
      {
        path: "/profile",
        element: <RestrictView />,
        children: [
          {
            path: "",
            element: <Profile />
          },
          {
            path: "settings",
            element: <Settings />
          }
        ]
      },
      {
        path: "support",
        element: <Support />
      },
      {
        path: "error-401",
        element: (
          <Error
            status={401}
            title="Unauthorized"
            description="User authorization is missing or required."
          />
        )
      },
      {
        path: "error-403",
        element: (
          <Error
            status={403}
            title="Forbidden"
            description="Malicious request or User authorization or CSRF token is not valid."
          />
        )
      },
      {
        path: "error-404-page",
        element: (
          <Error status={404} title="Page Not Found" description="The page you are looking for doesn't exist or was moved or deleted." />
        )
      },
      {
        path: "error-404-user",
        element: (
          <Error status={404} title="User Not Found" description="Unexpectedly we couldn't find your profile on our server." />
        )
      },
      {
        path: "error-429",
        element: (
          <Error
            status={429}
            title="Too Many Requests"
            description="You made too many requests to the our server in a short period, Quest Casino is temporarily locked down for you. Please come back again in an hour."
          />
        )
      },
      {
        path: "error-500",
        element: (
          <Error
            status={500}
            title="Internal Server Error"
            description="Unexpected server error or couldn't establish a connection."
          />
        )
      },
      {
        ...(typeof window !== "undefined" && {
          path: "*",
          element: <Navigate to="/error-404-page" replace />,
        })
      }
    ]
  },
  {
    path: "/action",
    children: [
      {
        path: "register",
        action: registerAction,
      }
    ],
  },
];
