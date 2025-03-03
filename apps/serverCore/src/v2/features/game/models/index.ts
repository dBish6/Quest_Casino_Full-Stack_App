import { model } from "mongoose";
import gameSchema, { gameBonusSchema, gameQuestSchema } from "./schemas/gameSchema";

export const Game = model("game", gameSchema),
  GameQuest = model("quest", gameQuestSchema),
  GameBonus = model("bonus", gameBonusSchema);
