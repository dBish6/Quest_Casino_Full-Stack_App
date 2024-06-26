import type { Request } from "express";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";

export default interface RegisterRequestDto extends Request {
  body: RegisterBodyDto;
}
