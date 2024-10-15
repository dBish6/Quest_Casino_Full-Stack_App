import type { Model } from "mongoose";
import type { GameDoc, GameQuestDoc, GameBonusDoc } from "@gameFeat/typings/Game";

import { Schema } from "mongoose";

import defaults from "@utils/schemaDefaults";

const gameSchema = new Schema<GameDoc, Model<GameDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["table", "slots", "dice"],
      required: true,
    },
    image: {
      _id: false,
      src: { type: String, required: true },
      alt: { type: String, required: true }
    },
    odds: {
      type: String,
      required: true,
      set: (odd: number) => odd.toFixed(2),
      validate: {
        validator: (odds: string) => /^\d+\.\d{2}$/.test(odds),
        message: (props: any) => `${props.value} must be a decimal number greater than or equal to 1.00.`
      }
    },
    origin: {
      type: String,
      required: true,
      default: "",
      validate: {
        validator: (url: string) => !url || /^https?:\/\//.test(url),
        message: (props: any) => `${props.value} is not a valid URL.`
      }
    },
    status: {
      type: String,
      enum: ["active", "development", "inactive"],
      required: true,
      default: "inactive"
    }
  },
  { collection: "game", ...defaults.options }
);
export default gameSchema;

export const gameQuestSchema = new Schema<GameQuestDoc, Model<GameQuestDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    reward: {
      type: Number,
      required: true,
      set: (reward: number) => reward * 100
    },
    for: { type: String, required: true },
    cap: { type: Number, required: true }, // Number to reach for completion.
  },
  { collection: "game_quest", ...defaults.options }
);

export const gameBonusSchema = new Schema<GameBonusDoc, Model<GameBonusDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    title: { type: String, required: true },
    multiplier: { type: Number, required: true },
    cap: { type: Number, required: true },
    expiry: { type: Number, require: true } // 1 day in milliseconds, etc.
  },
  { collection: "game_bonus", ...defaults.options }
);
