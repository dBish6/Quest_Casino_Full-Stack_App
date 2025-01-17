import type { Request } from "express";
import type { Game, Quest, Bonus } from "@gameFeat/typings/Game";

export interface AddGameBodyDto extends Omit<Game, "_id"> {}

export interface AddQuestBodyDto extends Omit<Quest, "_id"> {}

export interface AddBonusBodyDto extends Omit<Bonus, "_id" | "expiry"> {
  expiry?: number;
}

export interface AddGameRequestDto extends Request {
  body: AddGameBodyDto | AddQuestBodyDto | AddBonusBodyDto;
}
