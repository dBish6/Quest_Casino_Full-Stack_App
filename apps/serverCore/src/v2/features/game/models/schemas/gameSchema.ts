import type { Model } from "mongoose";
import type { GameDoc, GameQuestDoc, GameBonusDoc } from "@gameFeat/typings/Game";

import { Schema } from "mongoose";

import { GAME_CATEGORIES, GAME_STATUSES, GAME_QUEST_REWARD_TYPES, GAME_QUEST_FOR } from "@qc/constants";

import defaults from "@utils/schemaDefaults";

const gameSchema = new Schema<GameDoc, Model<GameDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    title: { type: String, immutable: true, unique: true, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: GAME_CATEGORIES,
      required: true
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
      enum: GAME_STATUSES,
      default: "inactive"
    }
  },
  { collection: "game", ...defaults.options }
);
export default gameSchema;

export const gameQuestSchema = new Schema<GameQuestDoc, Model<GameQuestDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    title: { type: String, immutable: true, unique: true, required: true },
    description: {
      type: String,
      required: true,
      maxlength: [81, "description field exceeds the max of 81 characters."]
    },
    reward: {
      type: {
        type: String,
        enum: GAME_QUEST_REWARD_TYPES,
        required: true
      },
      value: {
        type: Number,
        required: true,
        validate: {
          validator: (value: number) => value > 0,
          message: (props: any) => `${props.value} is not a valid reward value.`
        },
        set: function (value: any) {
          if (this.reward.type === "money") return Math.round(value * 100) / 100;
          return value;
        }
      }
    },
    for: {
      type: String,
      enum: { values: GAME_QUEST_FOR },
      required: true
    },
    cap: { type: Number, required: true }, // Number to reach for completion.
    status: { type: String, enum: ["active", "inactive"], default: "inactive" }
  },
  { collection: "game_quest", ...defaults.options }
);

export const gameBonusSchema = new Schema<GameBonusDoc, Model<GameBonusDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    title: { type: String, unique: true, required: true },
    multiplier: { type: Number, required: true }, // Is the reward.
    cap: { type: Number, required: true }, // Number to reach for completion.
    // (we could use the expired as of a way to know it is activated).
    expiry: { type: Number }, // 1 day from current date in milliseconds, etc.
    status: { type: String, enum: ["active", "inactive"], default: "inactive" } // Active or inactive for current period.
  },
  { collection: "game_bonus", ...defaults.options }
);
