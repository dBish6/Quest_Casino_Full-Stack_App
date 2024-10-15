import type { Request } from "express";
import type { UpdateProfileBodyDto, UpdateUserFavouritesBodyDto, ResetPasswordBodyDto } from "@qc/typescript/dtos/UpdateUserDto";

export interface UpdateProfileRequestDto extends Request {
  body: UpdateProfileBodyDto;
}

export interface UpdateUserFavouritesRequestDto extends Request {
  body: UpdateUserFavouritesBodyDto;
}

export interface ResetPasswordRequestDto extends Request {
  body: ResetPasswordBodyDto;
}
