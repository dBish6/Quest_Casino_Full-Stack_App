export interface FriendCredentials {
  avatar_url?: string;
  legal_name: { first: string; last: string };
  username: string;
  /**
   * Not given if the user not verified. When the user is verified it is the user's public profile link.
   */
  verification_token?: string;
  country: string;
  bio?: string;
}

/**
 * The available user credentials on the client.
 */
export interface UserCredentials extends FriendCredentials {
  type: "standard" | "google";
  email_verified: boolean;
  region?: string;
  phone_number?: string;
  balance: number;
  friends: FriendCredentials[];
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
