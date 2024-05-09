export default interface UserCredentials {
  type: "standard" | "google";
  avatar_url: string;
  legalName: { first: string; last: string };
  username: string;
  email: string;
  country: string;
  state?: string;
  phoneNumber?: string;
  balance: number;
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
  completedQuests: boolean[];
}
