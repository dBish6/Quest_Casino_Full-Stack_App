import type { Request } from "express";
import type { UserToClaims } from "@authFeat/typings/User";

export default interface RegisterRequestDto extends Request {
  body: Omit<UserToClaims, "_id"> & { password: string };
}
