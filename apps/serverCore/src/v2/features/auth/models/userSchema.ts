import { Schema } from "mongoose";

const userStatisticsSchema = new Schema(
  {
    losses: {
      type: {
        total: { type: Number, default: 0 },
        table: { type: Number, default: 0 },
        slots: { type: Number, default: 0 },
        dice: { type: Number, default: 0 },
      },
      // default: { total: 0, table: 0, slots: 0, dice: 0 },
    },
    wins: {
      type: {
        total: { type: Number, default: 0 },
        table: { type: Number, default: 0 },
        slots: { type: Number, default: 0 },
        dice: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
        win_rate: { type: Number, default: 0 },
      },
      // default: {
      //   total: 0,
      //   table: 0,
      //   slots: 0,
      //   dice: 0,
      //   streak: 0,
      //   win_rate: 0,
      // },
    },
    completed_quests: {
      type: Map,
      of: Boolean,
      default: new Map([
        ["name1", true],
        ["name2", true],
      ]),
      // type: Object,
      // validate: {
      //   validator: (quests) => {
      //     const keys = Object.keys(quests);

      //     return typeof keys[keys.length - 1] === "boolean";
      //   },
      //   message: (props) =>
      //     `${props.value} is not a valid object of completed quests.`,
      // },
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "user_statistics", _id: false }
);

const userActivitySchema = new Schema(
  {
    history: {
      type: [
        {
          game_name: String,
          result: {
            outcome: { type: String, enum: ["win", "loss"] },
            earnings: Number,
          },
          timestamp: Date,
        },
      ],
    },
    recently_played: { type: String },
    activity_timestamp: { type: Date, default: Date.now },
  },
  { collection: "user_activity", _id: false }
);

const userSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, unique: true },
    type: {
      type: String,
      enum: {
        values: ["standard", "google"],
        message: "type field must be either standard or google.",
      },
      required: true,
    },
    avatar_url: {
      type: String,
      validate: {
        validator: (url: string) => {
          return /^https?:\/\//.test(url);
        },
        message: (props: any) => `${props.value} is not a valid URL.`,
      },
      required: true,
    },
    legal_name: {
      type: { first: { type: String }, last: { type: String } },
      required: true,
    },
    username: {
      type: String,
      min: [3, "username field is less than the min of 3 characters."],
      max: [24, "username field exceeds the max of 24 characters."],
      required: true,
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String },
    phoneNumber: {
      type: Number,
      validate: {
        validator: (number?: string) => {
          // The phone number length can be 22 because of calling codes and the number format.
          return (
            !number ||
            (number.length >= 17 &&
              number.length <= 22 &&
              number.startsWith("+"))
          );
        },
        message: (props: any) => `${props.value} is not a valid phone number.`,
      },
    },
    balance: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    statistics: userStatisticsSchema,
    activity: userActivitySchema,
  },
  { collection: "user" }
);

export default userSchema;
