import type { Request } from "express";
import type {
  RegisterBodyDto,
  RegisterGoogleBodyDto,
} from "@qc/typescript/dtos/RegisterBodyDto";

export interface RegisterRequestDto extends Request {
  body: RegisterBodyDto;
}

export interface GoogleRegisterRequestDto extends Request {
  body: RegisterGoogleBodyDto;
}
