import { Request as ERequest, Response as EResponse } from "express";

import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
// import { isbot } from "isbot";

import { routes } from "./App";

export async function render(req: ERequest, res: EResponse) {
  const { query, dataRoutes } = createStaticHandler(routes),
    request = createFetchRequest(req, res),
    context = await query(request);

  if (
    context instanceof Response ||
    context.statusCode === 404 ||
    context.location.pathname === "/"
  ) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);
  return renderToString(
    <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
  );
}

export function createFetchRequest(req: ERequest, res: EResponse) {
  const origin = `${req.protocol}://${req.get("host")}`,
    url = new URL(req.originalUrl || req.url, origin),
    controller = new AbortController();

  res.on("close", () => controller.abort());

  const headers = new Headers();
  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return new Request(url.href, {
    method: req.method,
    headers,
    ...(req.method !== "GET" && req.method !== "HEAD" && { body: req.body }),
    signal: controller.signal,
  });
}
