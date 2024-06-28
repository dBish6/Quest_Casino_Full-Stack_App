import type { IncomingMessage, ServerResponse } from "http";
import type { NextFunction } from "express"; // ?
import { verifyUserToken as verifyUserTokenHttp } from "@authFeatHttp/middleware/tokens";

export default function verifyUserToken(
  req: IncomingMessage,
  res: ServerResponse,
  next: NextFunction
) {
  const isHandshake = req._query.sid === undefined;

  if (isHandshake) {
    verifyUserTokenHttp(req as any, res as any, next);
  } else {
    next();
  }
}
