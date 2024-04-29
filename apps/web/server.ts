/**
 * Server Side Rendering Server
 *
 * Description:
 * Dynamic Site Generation for pages, loads initial redux state, redirects, etc.
 */

import type { Request, Response as EResponse, NextFunction } from "express";

import express from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import sirv from "sirv";
import { installGlobals } from "@remix-run/node";

import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@redux/reducers";

installGlobals();

const { PROTOCOL, HOST, PORT: ENV_PORT } = process.env,
  PORT = Number(ENV_PORT) || 3000;

async function setupServer() {
  const app = express();
  let vite: ViteDevServer, ip: string | undefined;

  if (process.env.NODE_ENV === "development") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
    app.use(morgan("dev"));
  } else {
    app.use(
      sirv("build/client", {
        gzip: true,
      })
    );
  }

  app.get("/*", async (req: Request, res: EResponse, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template, render;

      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("./index.html"), "utf-8");
        // console.log("template", template);

        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("./src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(
          path.resolve("./build/client/index.html"),
          "utf-8"
        );
        // @ts-ignore
        render = (await import("./build/ssr/entry-server")).render;
      }

      const preloadedStateScript = getInitialReduxState();
      try {
        const appHtml = await render(req, res),
          html = template
            .replace("<!--ssr-outlet-->", appHtml)
            .replace("<!--init-state-->", preloadedStateScript);

        // console.log("appHtml", appHtml + "\n\n");
        // console.log("html", html);

        return res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (error: any) {
        if ("statusCode" in error && "location" in error) {
          if (error.statusCode === 404) {
            return res.redirect("/error-404");
          } else if (error.location.pathname === "/") {
            const incomingIp = req.socket.remoteAddress || req.ip;
            if (ip !== incomingIp) {
              ip = incomingIp;
              return res.redirect("/about");
            }

            return res.redirect("/home");
          }
        } else if (
          error instanceof Response &&
          error.status >= 300 &&
          error.status <= 399
        ) {
          return res.redirect(
            error.status,
            error.headers.get("Location") || ""
          );
        }

        throw error;
      }
    } catch (error: any) {
      process.env.NODE_ENV === "development" && vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  return app;
}

/**
 * Preloads the initial redux state for the client.
 */
function getInitialReduxState() {
  const store = configureStore({
    reducer: rootReducer,
  });

  return `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
    store.getState()
  ).replace(/</g, "\\u003c")}</script>`;
}

setupServer().then((app) =>
  app.listen(PORT, HOST!, () =>
    console.log(
      `Server is running on ${PROTOCOL}${HOST}:${PORT}; Ctrl-C to terminate...`
    )
  )
);
