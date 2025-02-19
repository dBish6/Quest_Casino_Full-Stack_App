export const GAME_STATUSES = ["active", "development", "inactive"] as const,
  GAME_CATEGORIES = ["table", "slots", "dice"] as const;

export type GameStatus = (typeof GAME_STATUSES)[number];
export type GameCategory = (typeof GAME_CATEGORIES)[number];

export const LEADERBOARD_TYPES = ["rate", "total"] as const;

export type LeaderboardType = (typeof LEADERBOARD_TYPES)[number];

export const GAME_QUEST_REWARD_TYPES = ["money", "spins"] as const,
  GAME_QUEST_FOR = ["all", "blackjack", "slots", "dice"] as const,
  GAME_QUEST_STATUSES = ["active", "inactive"] as const;

export type GameQuestRewardType = (typeof GAME_QUEST_REWARD_TYPES)[number];
export type GameQuestFor = (typeof GAME_QUEST_FOR)[number];
export type GameQuestStatus = (typeof GAME_QUEST_STATUSES)[number];

export const GAME_BONUS_STATUSES = ["active", "inactive"] as const;

export type GameBonusStatus = (typeof GAME_BONUS_STATUSES)[number];
