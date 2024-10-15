import type { Request } from "express";
import type { GameStatus } from "@qc/constants";

export interface AddGameBodyDto {
  title: string;
  description: string;
  image: { src: string; alt: string };
  odds: number;
  origin: string;
  status: GameStatus;
}

export interface AddGameRequestDto extends Request {
  body: AddGameBodyDto;
}
