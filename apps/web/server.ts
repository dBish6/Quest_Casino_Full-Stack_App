/**
 * Server Side Rendering Server
 *
 * Description:
 * Dynamic Site Generation for pages, loads initial redux state, redirects, etc.
 */

import type { Request, Response as EResponse, NextFunction } from "express";
import type { ViteDevServer } from "vite";
import type { AuthState } from "@authFeat/redux/authSlice";

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import sirv from "sirv";
import { hashSync } from "bcryptjs";

import { meta } from "@meta";
import { logger } from "@qc/utils";

import { configureStore, nanoid } from "@reduxjs/toolkit";
// TODO: shared/redux/index.ts OR Lazy import it? (no just split the logic, lazy imports bundle anyways?).
import { rootReducer } from "@redux/reducers";

const { PROTOCOL, HOST, PORT: ENV_PORT } = process.env,
  PORT = Number(ENV_PORT) || 3000;

const _dirname = dirname(fileURLToPath(import.meta.url));

async function setupServer() {
  const app = express();
  let vite: ViteDevServer | undefined, ip: string | undefined;

  if (process.env.NODE_ENV === "development") {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom"
    });

    app.use(vite.middlewares);
    app.use(morgan("dev"));
  } else {
    app.use(sirv(join(_dirname, "public"), { gzip: true }));
    app.use(morgan("combined"));
  }

  app.get("/*", async (req: Request, res: EResponse, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template, render;
      const pageMeta = meta[req.path as keyof typeof meta] || { title: "Quest Casino", tags: [] };

      if (process.env.NODE_ENV === "development") {
        template = readFileSync("index.html", "utf-8");

        template = await vite!.transformIndexHtml(url, template);
        render = (await vite!.ssrLoadModule("./src/entry-server.tsx")).render; // Makes it compatible with vite ssr in dev and hmr, etc.
      } else {
        template = readFileSync(
          join(_dirname, "./public/index.html"),
          "utf-8"
        );
        render = (await import("./src/entry-server")).render; // Bundles entry-server.tsx with the server. No need to import from the build like in the examples, they are just bundled together for my use case.
      }
      // console.log("template", template);
      // console.log("render", render);

      try {
        const { preloadedStateScript, store } = getInitialReduxState();

        const appHtml = await render(req, res, store),
          html = template
            .replace("<!--ssr-outlet-->", appHtml)
            .replace("<!--init-state-->", preloadedStateScript)
            .replace("<!--title-->", pageMeta.title)
            .replace("<!--meta-->", pageMeta.tags.join("\n\t"));

        return res.status(200).setHeader("Content-Type", "text/html").end(html);
      } catch (error: any) {
        if ("statusCode" in error && "location" in error) {
          if (error.statusCode === 404) {
            return res.redirect("/error-404-page");
          } else if (error.location.pathname === "/") {
            const incomingIp =
              (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
              req.socket.remoteAddress ||
              req.ip;
            if (ip !== incomingIp) {
              ip = incomingIp;
              return res.redirect(url.replace(req.path, "/about"));
            }

            return res.redirect(url.replace(req.path, "/home"));
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
      process.env.NODE_ENV === "development" && vite!.ssrFixStacktrace(error);
      next(error);
    }
  });

  return app;
}

/**
 * Preloads the initial redux state for the client and also generates the initial oState token for the google login.
 */
function getInitialReduxState() {
  const store = configureStore({ reducer: rootReducer }),
    oStateToken = nanoid();

  const initialAuthState: AuthState = {
    user: {
      credentials: null,
      token: {
        oState: { original: oStateToken, secret: hashSync(oStateToken, 6) },
        csrf: null
      }
    }
  };

  const preloadedStateScript = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(
    {
      ...store.getState(),
      auth: initialAuthState
    }
  ).replace(/</g, "\\u003c")}</script>`;

  return { preloadedStateScript, store };
}

setupServer().then((app) =>
  app.listen(PORT, HOST!, () =>
    logger.info(
      `Server is running on ${PROTOCOL}${HOST}:${PORT}; Ctrl-C to terminate...`
    )
  )
);
