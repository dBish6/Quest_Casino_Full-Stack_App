export default interface UserCredentials {
  type: "standard" | "google";
  avatar_url: string;
  legal_name: { first: string; last: string };
  username: string;
  email: string;
  email_verified: boolean;
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
