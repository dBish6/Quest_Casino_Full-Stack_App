import type { Request } from "express";
import type { LoginBodyDto, LoginGoogleBodyDto } from "@qc/typescript/dtos/LoginBodyDto";

export interface LoginRequestDto extends Request {
  body: LoginBodyDto;
}

export interface GoogleLoginRequestDto extends Request {
  body: LoginGoogleBodyDto;
}
