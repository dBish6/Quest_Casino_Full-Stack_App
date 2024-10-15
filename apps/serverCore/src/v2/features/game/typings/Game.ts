import type { Document, ObjectId } from "mongoose";
import type DefaultDocFields from "@typings/DefaultDocFields";
import type { GameStatus, GameCategory } from "@qc/constants";

export interface Game extends DefaultDocFields {
  _id: ObjectId;
  title: string;
  description: string;
  category: GameCategory;
  image: { src: string; alt: string };
  odds: string;
  origin: string;
  status: GameStatus;
}

export interface GameDoc extends Document, Game {
  _id: ObjectId;
}

export interface Quest extends DefaultDocFields {
  _id: ObjectId;
  title: string;
  description: string;
  reward: number;
  for: string;
  cap: number;
}

export interface GameQuestDoc extends Document, Quest {
  _id: ObjectId;
}

export interface Bonus extends DefaultDocFields {
  _id: ObjectId;
  title: string;
  multiplier: number;
  cap: number;
  expiry: number;
}

export interface GameBonusDoc extends Document, Bonus {
  _id: ObjectId;
}
