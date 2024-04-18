/**
 * Server Side Rendering Server
 *
 * Description:
 * Dynamic Site Generation for front-end pages.
 */

import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer, ViteDevServer } from "vite";
import morgan from "morgan";
import fs from "fs";
import * as nodePath from "path";
import sirv from "sirv";

import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@redux/reducers";

import paths from "@routes/paths";

const { PROTOCOL, HOST, PORT: ENV_PORT } = process.env,
  PORT = Number(ENV_PORT) || 3000;

const setupServer = async () => {
  const app = express();

  let vite: ViteDevServer;
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

  app.get("/*", async (req: Request, res: Response, next: NextFunction) => {
    const path = req.originalUrl;

    if (path === "/") res.redirect("/about");
    else if (!paths.has(path)) res.redirect("/error-404");

    try {
      let template, render;

      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(nodePath.resolve("./index.html"), "utf-8");
        // console.log("template", template);

        template = await vite.transformIndexHtml(path, template);
        render = (await vite.ssrLoadModule("./src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(
          nodePath.resolve("./build/client/index.html"),
          "utf-8"
        );
        // @ts-ignore
        render = (await import("./build/ssr/entry-server")).render;
      }
      const store = configureStore({
          reducer: rootReducer,
        }),
        // Preloads the initial redux state for the client.
        preloadedStateScript = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
          store.getState()
        ).replace(/</g, "\\u003c")}</script>`;

      const appHtml = await render({ path, store }),
        html = template
          .replace("<!--ssr-outlet-->", appHtml)
          .replace("<!--init-state-->", preloadedStateScript);

      // console.log("html", html);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error: any) {
      process.env.NODE_ENV === "development" && vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  return app;
};

setupServer().then((app) =>
  app.listen(PORT, HOST!, () =>
    console.log(
      `Server is running on ${PROTOCOL}${HOST}:${PORT}; Ctrl-C to terminate...`
    )
  )
);
