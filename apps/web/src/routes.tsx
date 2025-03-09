import type { CarouselContentResponseDto } from "@views/home/_components/Carousel";

import { type RouteObject, Navigate } from "react-router-dom";

import GENERAL_UNAUTHORIZED_MESSAGE from "@authFeat/constants/GENERAL_UNAUTHORIZED_MESSAGE";

import { ResourceLoaderProvider } from "@components/loaders";
import { BreakpointProvider, Dashboard } from "@components/dashboard";
import { LeaderboardProvider } from "@gameFeat/components/modals/menu/slides";
import SocketListenersProvider from "@components/SetupSocketListeners";
import { ModalsProvider } from "@components/modals";

import { RestrictView, About, Home, Support } from "@views/index";
import { Error } from "@views/errors";

export const getCarouselContentLoader = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_CDN_URL}/carousel/carousel.json`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(typeof window === "undefined" && { Referer: process.env.VITE_APP_URL })
          }
        }
      ),
      data: CarouselContentResponseDto = await res.json();

    if (!res.ok)
      return Response.json(
        { ERROR: (data as any).message || "Unexpectedly failed to fetch carousel content." },
        { status: res.status }
      );

    return Response.json({ message: "Successfully retrieved carousel content", ...data }, { status: res.status });
  } catch (error) {
    return Response.json(
      { ERROR: "Unexpectedly failed to initiate carousel content request." },
      { status: 500 }
    );
  }
};

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <ResourceLoaderProvider>
          <BreakpointProvider>
            <LeaderboardProvider>
              <SocketListenersProvider />

              <Dashboard />

              <ModalsProvider />
            </LeaderboardProvider>
          </BreakpointProvider>
        </ResourceLoaderProvider>
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
        loader: getCarouselContentLoader
      },
      {
        path: "/profile",
        element: <RestrictView />,
        children: [
          {
            path: "",
            lazy: async () => {
              const { Profile } = await import("@views/index");
              return { Component: Profile };
            }
          },
          {
            path: "settings",
            lazy: async () => {
              const { Settings } = await import("@views/index");
              return { Component: Settings };
            }
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
            description={GENERAL_UNAUTHORIZED_MESSAGE}
          />
        )
      },
      {
        path: "error-403",
        element: (
          <Error
            status={403}
            title="Forbidden"
            description="Malicious request or User authorization is not valid."
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
          element: <Navigate to="/error-404-page" replace />
        })
      }
    ]
  },
  {
    path: "/action",
    children: []
  }
];
