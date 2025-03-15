import type { UserClaims, VerificationClaims } from "@authFeat/typings/User";

declare module "express-serve-static-core" {
  interface Request {
    userDecodedClaims?: UserClaims;
    verDecodedClaims?: VerificationClaims;
  }
}

declare module "http" {
  interface IncomingMessage {
    _query?: any;
    cookies?: Record<string, any>;
  }
}

declare module "socket.io" {
  interface Socket {
    userDecodedClaims?: UserClaims;
  }
}
