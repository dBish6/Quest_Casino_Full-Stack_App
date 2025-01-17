import type { Request } from "express";
import type { UpdateProfileBodyDto, UpdateUserFavouritesBodyDto, SendConfirmPasswordEmailBodyDto } from "@qc/typescript/dtos/UpdateUserDto";

export interface UpdateProfileRequestDto extends Request {
  body: UpdateProfileBodyDto;
}

export interface UpdateUserFavouritesRequestDto extends Request {
  body: UpdateUserFavouritesBodyDto;
}

export interface SendConfirmPasswordEmailRequestDto extends Request {
  body: SendConfirmPasswordEmailBodyDto;
}
