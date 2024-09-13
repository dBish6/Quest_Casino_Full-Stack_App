export type ActivityStatuses = "online" | "away" | "offline";

/**
 * The absolute minimum user credentials that can be sent to the client.
 */
export interface MinUserCredentials {
  avatar_url?: string;
  legal_name: { first: string; last: string };
  username: string;
  verification_token: string;
}

/**
 * All credentials on the client of a friend of a user.
 */
export interface FriendCredentials extends MinUserCredentials {
  country: string;
  bio?: string;
  /** The very last private message sent in the friend room (private room). */
  last_chat_message?: string;
  activity: { status: ActivityStatuses, inactivity_timestamp?: string };
}

/**
 * The user credentials on the client of the current user.
 */
export interface UserCredentials extends Omit<FriendCredentials, "activity" > {
  type: "standard" | "google";
  email_verified: boolean;
  region?: string;
  phone_number?: string;
  balance: number;
  friends: {
    pending: { [verification_token: string]: MinUserCredentials };
    list: { [verification_token: string]: FriendCredentials };
  };
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
    completed_quests: { [id: string]: boolean };
  };
}
