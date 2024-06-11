export default interface UserCredentials {
  type: "standard" | "google";
  avatar_url?: string;
  legal_name: { first: string; last: string };
  email_verified: boolean;
  username: string;
  /**
   * Not given if the user not verified. When the user is verified it is the user's public profile link.
   */
  verification_token?: string;
  country?: string;
  region?: string;
  phone_number?: string;
  bio?: string;
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
