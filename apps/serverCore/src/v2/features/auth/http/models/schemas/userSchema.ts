import type { Model } from "mongoose";
import type {
  UserDoc,
  UserDocStatistics,
  UserDocActivity,
} from "@authFeatHttp/typings/User";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";

import { Schema } from "mongoose";
import defaults from "@utils/schemaDefaults";

export const userStatisticsSchema = new Schema<
  UserDocStatistics,
  Model<UserDocStatistics>
>(
  {
    _id: { type: Schema.ObjectId, immutable: true },
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
    ...defaults.options,
  }
);

export const userActivitySchema = new Schema<
  UserDocActivity,
  Model<UserDocActivity>
>(
  {
    _id: { type: Schema.ObjectId, immutable: true },
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
    ...defaults.options,
  }
);

const userSchema = new Schema<UserDoc, Model<UserDoc>>(
  {
    _id: { type: Schema.ObjectId, immutable: true },
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
      minlength: [3, "username field is less than the min of 3 characters."],
      maxlength: [24, "username field exceeds the max of 24 characters."],
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
    bio: {
      type: String,
      maxlength: [338, "bio field exceeds the max of 338 characters."],
    },
    balance: { type: Number, default: 0 },
    // TODO:
    friends: {
      _id: false,
      type: [
        {
          avatar_url: { type: String },
          legal_name: {
            _id: false,
            type: { first: { type: String }, last: { type: String } },
            required: true,
          },
          username: { type: String, required: true },
          verification_token: { type: String },
          country: { type: String, required: true },
          bio: { type: String },
        },
      ],
      validate: {
        validator: (friends: FriendCredentials[]) => friends.length <= 25,
        message: "friends field exceeded the max of 25 friends.",
      },
      // default: [],
    },
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
  { collection: "user", ...defaults.options }
);

export default userSchema;
