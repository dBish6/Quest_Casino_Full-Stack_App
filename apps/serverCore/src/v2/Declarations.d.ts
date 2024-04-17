import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

declare module "express-serve-static-core" {
  interface Request {
    userIdToken?: string;
    decodedClaims?: DecodedIdToken;
  }
}

// FIXME: I am trying to override email in DecodedIdToken because email is optional for some reason.
// interface ModifiedDecodedIdToken extends DecodedIdToken {
//   // Override the existing email property
//   email: string;
//   // Add any additional properties you need
//   ass: string;
// }

// declare module "firebase-admin/lib/auth/token-verifier" {
//   interface DecodedIdToken extends Omit<DecodedIdToken, "email"> {
//     email: string;
//     ass: string;
//   }
// }
