import type { Model } from "mongoose";
import type { UserDoc, UserDocFriends, UserDocStatistics, UserDocActivity, UserDocNotifications } from "@authFeat/typings/User";

import { Schema } from "mongoose";
import { randomUUID } from "crypto";

import defaults from "@utils/schemaDefaults";

export const userFriendsSchema = new Schema<
  UserDocFriends,
  Model<UserDocFriends>
>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    pending: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "user" },
      default: new Map(),
      validate: {
        validator: (friends: Map<any, any>) => friends.size <= 50,
        message: "Pending friends exceeded the maximum of 50 friends.",
      }
    },
    list: {
      type: Map,
      of: { type: Schema.Types.ObjectId, ref: "user" },
      default: new Map(),
      validate: {
        validator: (friends: Map<any, any>) => friends.size <= 50,
        message: "Friends list exceeded the maximum of 50 friends.",
      }
    }
  },
  {
    collection: "user_friends",
    ...defaults.options
  }
);

export const userStatisticsSchema = new Schema<
  UserDocStatistics,
  Model<UserDocStatistics>
>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
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
    progress: {
      _id: false,
      quest: {
        type: Map,
        of: {
          quest: { type: Schema.Types.ObjectId, ref: "quest" },
          current: { type: Number, required: true, default: 0 },
          completed: {
            type: Boolean,
            required: true,
            default: false,
            validate: {
              validator: function (value: boolean) {
                return !(value === true && this.current < this.cap);
              },
              message: "Quest cannot be marked as completed unless the current progress equals or exceeds the cap.",
            },
          },
        },
        // default: new Map([])
      },
      bonus: {
        type: Map,
        of: {
          bonus: { type: Schema.Types.ObjectId, ref: "bonus" },
          current: { type: Number, required: true, default: 0 },
          activated: { type: Boolean, required: true, default: false },
          completed: { type: Boolean, required: true, default: false }, // When activated and reaches the expiry.
        },
        // default: new Map([])
      }
    }
  },
  {
    collection: "user_statistics",
    ...defaults.options
  }
);

export const userActivitySchema = new Schema<
  UserDocActivity,
  Model<UserDocActivity>
>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    history: {
      type: [
        {
          _id: false,
          game_name: { type: String, required: true },
          result: {
            outcome: { type: String, enum: ["win", "loss"], required: true },
            earnings: { type: Number, required: true },
          },
          timestamp: { type: Date, default: Date.now }
        }
      ]
    },
    recently_played: { type: String },
  },
  {
    collection: "user_activity",
    ...defaults.options
  }
);

const notification = new Schema({
  _id: { type: Schema.Types.ObjectId, immutable: true },
  notification_id: { type: String, immutable: true, default: () => randomUUID() },
  type: { type: String, enum: ["news", "system", "general"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: {
    sequence: { type: String },
    to: { type: String }
  },
  created_at: { type: Date, default: Date.now },
}).index({ created_at: -1 });
export const userNotificationsSchema = new Schema<
  UserDocNotifications,
  Model<UserDocNotifications>
>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    friend_requests: [{ type: Schema.Types.ObjectId, ref: "user" }],
    notifications: {
      news: {
        _id: false,
        type: [notification]
      },
      system: {
        _id: false,
        type: [notification]
      },
      general: { 
        _id: false,
        type: [notification]
      }
    }
  },
  {
    collection: "user_notifications",
    ...defaults.options
  }
);

const userSchema = new Schema<UserDoc, Model<UserDoc>>(
  {
    _id: { type: Schema.Types.ObjectId, immutable: true },
    type: {
      type: String,
      enum: {
        values: ["standard", "google"],
        message: "type field must be either standard or google."
      },
      immutable: true,
      required: true
    },
    avatar_url: {
      type: String,
      validate: {
        validator: (url: string) => /^https?:\/\//.test(url),
        message: (props: any) => `${props.value} is not a valid URL.`
      }
    },
    legal_name: {
      _id: false,
      type: { first: { type: String }, last: { type: String } },
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    email_verified: { type: Boolean, default: false },
    username: {
      type: String,
      minlength: [3, "username field is less than the min of 3 characters."],
      maxlength: [24, "username field exceeds the max of 24 characters."],
      unique: true, // TODO: Remove this and make a middleware that not on the error from this since this creates a index we don't need.
      required: true
    },
    verification_token: { type: String, immutable: true, required: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String },
    phone_number: {
      type: String,
      validate: {
        validator: (phone?: string) => !phone || /^\+\d{1,6}\s\(\d{1,4}\)\s\d{1,4}-\d{1,4}$/.test(phone),
        message: (props: any) => `${props.value} is not a valid phone number.`
      }
    },
    bio: {
      type: String,
      maxlength: [338, "bio field exceeds the max of 338 characters."]
    },
    balance: { type: Number, default: 0 },
    favourites: { type: Map, of: Boolean, default: new Map() },
    friends: {
      type: Schema.Types.ObjectId,
      ref: "friends",
      required: true
    },
    statistics: {
      type: Schema.Types.ObjectId,
      ref: "statistics",
      required: true
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: "activity",
      required: true
    },
    notifications: {
      type: Schema.Types.ObjectId,
      ref: "notifications",
      required: true
    }
  },
  { collection: "user", ...defaults.options }
);

export default userSchema;
