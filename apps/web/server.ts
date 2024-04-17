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
import path from "path";
import sirv from "sirv";

// TODO: Redirect to the About here?

const PORT = Number(process.env.HOST) || 3000;

const createServer = async () => {
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

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    console.log("url", url);
    try {
      let template, render;

      if (process.env.NODE_ENV === "development") {
        template = fs.readFileSync(path.resolve("./index.html"), "utf-8");
        console.log("template", template);

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
      const appHtml = await render({ path: url }),
        html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error: any) {
      process.env.NODE_ENV === "development" && vite.ssrFixStacktrace(error);
      next(error);
    }
  });

  return app;
};

createServer().then((app) =>
  app.listen(PORT, "localhost", () =>
    console.log(
      `Server is running on ${process.env.PROTOCOL}${process.env.HOST}:${PORT}; Ctrl-C to terminate...`
    )
  )
);
