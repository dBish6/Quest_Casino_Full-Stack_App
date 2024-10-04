export const GAME_STATUSES = ["active", "development", "inactive"] as const,
  GAME_CATEGORIES = ["table", "slots", "dice"] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];
export type GameCategory = (typeof GAME_CATEGORIES)[number];
