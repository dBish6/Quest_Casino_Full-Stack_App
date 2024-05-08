import { Request } from "express";

export default interface RegisterRequestDto extends Request {
  body: {
    type: "standard" | "google";
    legalName: { first: string; last: string };
    username: string;
    email: string;
    password: string;
    country: string;
    state?: string;
    phoneNumber?: string;
  };
}
