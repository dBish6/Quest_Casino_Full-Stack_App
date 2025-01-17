import type { Request } from "express";
import type LogoutBodyDto from "@qc/typescript/dtos/LogoutBodyDto";

export default interface LogoutRequestDto extends Request {
  body: LogoutBodyDto;
}
