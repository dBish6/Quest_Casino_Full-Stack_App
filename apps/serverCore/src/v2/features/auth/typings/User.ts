import type { Document, ObjectId } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { NotificationTypes, Notification } from "@qc/typescript/dtos/NotificationsDto";
import type DefaultDocFields from "@typings/DefaultDocFields";

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
  verification_token?: string;
  username: string;
  country: string;
  region?: string;
  phone_number?: string;
}

export interface UserClaims extends JwtPayload {
  sub: string; // (_id) There is always a subject for the user token.
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
  /**
   * Used as a verification token for generating a unique verification link and used with friend rooms.
   */
  verification_token: string;
  password: string;
  country: string;
  region?: string;
  phone_number?: string;
  bio?: string;
  balance: number;
  friends: { pending: ObjectId[]; list: ObjectId[] };
  statistics: UserDocStatistics;
  activity: UserDocStatistics;
  notifications: UserDocNotifications;
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
  completed_quests: Map<string, boolean>;
}

export interface UserDocActivity extends Document, DefaultDocFields {
  _id: ObjectId;
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

export interface UserDoc extends Document, User {
  _id: ObjectId;
}
