import type { Document, ObjectId } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import type DefaultDocFields from "@typings/DefaultDocFields";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { ActivityStatuses } from "@qc/typescript/typings/UserCredentials";
import type { NotificationTypes, Notification } from "@qc/typescript/dtos/NotificationsDto";
import type { GameQuestDoc, GameBonusDoc } from "@gameFeat/typings/Game";

export type RegistrationTypes = "standard" | "google";
export type GetUserBy = "_id" | "email" | "username" | "verification_token";

/**
 * Type for creating a initial user in the database.
 */
export interface InitializeUser
  extends Omit<RegisterBodyDto, "con_password" | "calling_code"> {
  type: RegistrationTypes;
  avatar_url?: string;
  first_name: string;
  last_name: string;
  email_verified?: boolean;
}

export interface UserToClaims {
  _id: ObjectId;
  type: RegistrationTypes;
  legal_name: { first: string; last: string };
  email: string;
  verification_token: string;
  username: string;
  country: string;
  region?: string;
  phone_number?: string;
}

export interface UserClaims extends JwtPayload {
  /** The user's `_id` as a string. */
  sub: string;
  type: RegistrationTypes;
  legal_name: { first: string; last: string };
  email: string;
  username: string;
  verification_token: string;
  country: string;
  region?: string;
  phone_number?: string;
}

/**
 * All fields within a user document.
 */
export interface User extends DefaultDocFields {
  _id: ObjectId;
  type: string;
  avatar_url?: string;
  legal_name: {
    first: string;
    last: string;
  };
  email: string;
  email_verified: boolean;
  username: string;
  /** Used as a verification token for generating a unique verification link and used with friend rooms. */
  verification_token: string;
  password: string;
  country: string;
  region?: string;
  phone_number?: string;
  bio?: string;
  balance: number;
  favourites: Map<string, boolean>;
  friends: UserDocFriends;
  statistics: UserDocStatistics;
  activity: UserDocActivity;
  notifications: UserDocNotifications;
}

export interface UserDoc extends Document, User {
  _id: ObjectId;
}

export interface UserDocFriends extends Document, DefaultDocFields {
  _id: ObjectId;
  /**
   * Maps `verification_token` to user ObjectIds for friends that are pending.
   */
  pending: Map<string, UserDoc>;
  /**
   * Maps `verification_token` to user ObjectIds for friends that are added.
   */
  list: Map<string, UserDoc>;
}

export interface UserDocStatistics extends Document, DefaultDocFields {
  _id: ObjectId;
  losses: {
    total: number;
    table: number;
    slots: number;
    dice: number;
  };
  wins: {
    total: number;
    table: number;
    slots: number;
    dice: number;
    streak: number;
    win_rate: number;
  };
  progress: {
    quest: Map<
      string,
      {
        quest: GameQuestDoc;
        current: number;
        completed: boolean;
      }
    >;
    bonus: Map<
      string,
      {
        bonus: GameBonusDoc;
        current: number;
        activated: boolean;
        completed: boolean;
      }
    >;
  };
}

export interface UserDocActivity extends Document, DefaultDocFields {
  _id: ObjectId;
  status: ActivityStatuses;
  history: {
    game_name: string;
    result: {
      outcome: "win" | "loss";
      earnings: number;
    };
    timestamp: Date;
  }[];
  recently_played?: string;
  activity_timestamp: Date;
}

export interface UserNotification extends Omit<Notification, "_id" | "created_at"> {
  _id: ObjectId;
  created_at: Date;
}
export type UserNotificationField = {
  [key in NotificationTypes]: UserNotification[];
};
export interface UserDocNotifications extends Document, DefaultDocFields {
  _id: ObjectId;
  friend_requests: ObjectId[];
  notifications: UserNotificationField;
}
