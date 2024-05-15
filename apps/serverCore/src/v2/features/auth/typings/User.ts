import type { ObjectId } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";

export interface UserToClaims {
  _id: ObjectId;
  type: "standard" | "google";
  legal_name: { first: string; last: string };
  username: string;
  email: string;
  country: string;
  region?: string;
  phone_number?: string;
}

export interface UserClaims extends JwtPayload {
  sub: string; // (_id) There is always a subject for the user token.
  type: "standard" | "google";
  legal_name: { first: string; last: string };
  username: string;
  email: string;
  country: string;
  region?: string;
  phone_number?: string;
}

export interface ClientUser {
  type: "standard" | "google";
  avatar_url: string;
  legal_name: { first: string; last: string };
  username: string;
  email: string;
  country: string;
  region?: string;
  phone_number?: string;
  balance: number;
  statistics: {
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
  };
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
  username: string;
  email: string;
  password: string;
  country: string;
  region?: string;
  phone_number?: string;
  balance: number;
  statistics: UserDocStatistics;
  activity: UserDocStatistics;
}
