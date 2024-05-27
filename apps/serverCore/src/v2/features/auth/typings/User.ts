import type { ObjectId } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";
import { RegisterBodyDto } from "@qc/typescript/dtos/RegisterBodyDto";

export type RegistrationTypes = "standard" | "google";

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

interface SharedDocFields {
  created_at: Date;
  updated_at: Date;
}

export interface UserDocStatistics extends SharedDocFields {
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

export interface UserDocActivity extends SharedDocFields {
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

/**
 * User fields within the document in the database.
 */
export interface UserDoc extends SharedDocFields {
  _id: ObjectId;
  type: string;
  avatar_url: string;
  legal_name: {
    first: string;
    last: string;
  };
  email: string;
  email_verified: boolean;
  username: string;
  verification_token?: string;
  password: string;
  country: string;
  region?: string;
  phone_number?: string;
  balance: number;
  statistics: UserDocStatistics;
  activity: UserDocStatistics;
}
