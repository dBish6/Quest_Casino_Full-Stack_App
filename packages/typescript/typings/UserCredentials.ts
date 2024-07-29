/**
 * The absolute minimum user credentials that can be sent to the client.
 */
export interface MinUserCredentials {
  avatar_url?: string;
  legal_name: { first: string; last: string };
  username: string;
}

/**
 * All credentials on the client of a friend of a user.
 */
export interface FriendCredentials {
  avatar_url?: string;
  legal_name: { first: string; last: string };
  username: string;
  /**
   * Not given if the user not verified.
   */
  verification_token?: string;
  country: string;
  bio?: string;
  /**
   * When the timestamp is not null it means they are either online or away.
   */
  activity_timestamp: Date | null;
  status?: "online" | "away" | "offline"; // Could have this initialized on the client? Or stored somewhere else?
}

/**
 * The user credentials on the client of the current user.
 */
export interface UserCredentials
  extends Omit<FriendCredentials, "activity_timestamp" | "status"> {
  type: "standard" | "google";
  // avatar_url?: string;
  // legal_name: { first: string; last: string };
  email_verified: boolean;
  // username: string;
  /**
   * Not given if the user not verified. When the user is verified it is the user's public profile link.
   */
  // verification_token?: string;
  // country?: string;
  region?: string;
  phone_number?: string;
  // bio?: string;
  balance: number;
  friends: {
    pending: MinUserCredentials[];
    list: FriendCredentials[];
  };
  // activity_timestamp?: Date;
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
  // notifications should not be on the user, there would be a crazy amount.
}

// I have no clue where this type came from, I am thinking if they're not a friend, 
// then there is no timestamp of status for the global chat
/**
 * TODO: Idk what to call or say for this one.
 * 
 * The credentials of non-friends of a user on the client.
 */
export type CommonUserCredentials = Omit<
  FriendCredentials,
  "activity_timestamp" | "status"
>;
