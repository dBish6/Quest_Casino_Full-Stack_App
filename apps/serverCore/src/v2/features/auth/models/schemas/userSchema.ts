import { type Model, Schema } from "mongoose";
import type {
  UserDoc,
  UserDocStatistics,
  UserDocActivity,
} from "@authFeat/typings/User";
import shared from "../shared";

export const userStatisticsSchema = new Schema<
  UserDocStatistics,
  Model<UserDocStatistics>
>(
  {
    _id: { type: Schema.ObjectId },
    losses: {
      _id: false,
      type: {
        total: { type: Number },
        table: { type: Number },
        slots: { type: Number },
        dice: { type: Number },
      },
      default: { total: 0, table: 0, slots: 0, dice: 0 },
    },
    wins: {
      _id: false,
      type: {
        total: { type: Number },
        table: { type: Number },
        slots: { type: Number },
        dice: { type: Number },
        streak: { type: Number },
        win_rate: { type: Number },
      },
      default: {
        total: 0,
        table: 0,
        slots: 0,
        dice: 0,
        streak: 0,
        win_rate: 0,
      },
    },
    completed_quests: {
      type: Map,
      of: Boolean,
      default: new Map([]),
    },
  },
  {
    collection: "user_statistics",
    ...shared.options,
  }
);

export const userActivitySchema = new Schema<
  UserDocActivity,
  Model<UserDocActivity>
>(
  {
    _id: { type: Schema.ObjectId },
    history: {
      type: [
        {
          _id: false,
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
  {
    collection: "user_activity",
    ...shared.options,
  }
);

const userSchema = new Schema<UserDoc, Model<UserDoc>>(
  {
    _id: { type: Schema.ObjectId },
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
    },
    legal_name: {
      _id: false,
      type: { first: { type: String }, last: { type: String } },
      required: true,
    },
    email: { type: String, lowercase: true, trim: true, required: true },
    email_verified: { type: Boolean, default: false },
    username: {
      type: String,
      min: [3, "username field is less than the min of 3 characters."],
      max: [24, "username field exceeds the max of 24 characters."],
      unique: true,
      required: true,
    },
    verification_token: { type: String },
    password: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String },
    phone_number: {
      type: String,
      validate: {
        validator: (phone?: string) => {
          return (
            !phone || /^\+\d{1,6}\s\(\d{1,4}\)\s\d{1,4}-\d{1,4}$/.test(phone)
          );
        },
        message: (props: any) => `${props.value} is not a valid phone number.`,
      },
    },
    balance: { type: Number, default: 0 },
    statistics: {
      type: Schema.ObjectId,
      ref: "statistics",
      required: true,
    },
    activity: {
      type: Schema.ObjectId,
      ref: "activity",
      required: true,
    },
  },
  { collection: "user", ...shared.options }
);

export default userSchema;
