import type { Request } from "express";
import type { UserClaims } from "@authFeatHttp/typings/User";

declare module "express-serve-static-core" {
  interface Request {
    loginMethod?: "email" | "username";
    decodedClaims?: UserClaims;
  }
}

declare module "http" {
  interface IncomingMessage {
    _query?: any;
    cookies?: Record<string, any>;
    decodedClaims?: UserClaims;
  }
}
