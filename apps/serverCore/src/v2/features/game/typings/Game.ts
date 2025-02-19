import type { Document, ObjectId } from "mongoose";
import type DefaultDocFields from "@typings/DefaultDocFields";
import type { Quest as ClientQuest } from "@qc/typescript/dtos/GetQuestsDto";
import type { Game as ClientGame } from "@qc/typescript/dtos/GetGamesDto";
import type { Bonus as ClientBonus } from "@qc/typescript/dtos/GetBonusesDto";
import type { GameQuestStatus } from "@qc/constants";

export interface Game extends ClientGame, DefaultDocFields {
  _id: ObjectId;
}

export interface GameDoc extends Document, Game {
  _id: ObjectId;
}

export interface Quest extends Omit<ClientQuest, "status">, DefaultDocFields {
  _id: ObjectId;
  /** Active or inactive for the current period. */
  status: GameQuestStatus;
}

export interface GameQuestDoc extends Document, Quest {
  _id: ObjectId;
}

export interface Bonus extends Omit<ClientBonus, "status">, DefaultDocFields {
  /** Active or inactive for the current period. */
  status: "active" | "inactive";
}

export interface GameBonusDoc extends Document, Bonus {
  _id: ObjectId;
}
