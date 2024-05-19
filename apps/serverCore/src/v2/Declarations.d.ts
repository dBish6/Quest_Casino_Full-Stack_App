import { Request } from "express";
import { UserClaims } from "@authFeat/typings/User";

declare module "express-serve-static-core" {
  interface Request {
    userIdToken?: string;
    decodedClaims?: UserClaims;
  }
}
