import type { Request } from "express";
import { DeleteNotificationsBodyDto } from "@qc/typescript/dtos/NotificationsDto";

export interface DeleteNotificationsRequestDto extends Request {
  body: DeleteNotificationsBodyDto;
}
