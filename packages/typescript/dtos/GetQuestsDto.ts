import type { GameQuestRewardType, GameQuestFor, GameQuestStatus } from "@qc/constants";

export interface Quest {
  title: string;
  description: string;
  reward: {
    type: GameQuestRewardType;
    value: number;
  };
  for: GameQuestFor;
  /** Number to reach for completion. */
  cap: number;
  /** Active or inactive for the current period. */
  status?: GameQuestStatus;
}

export interface GetQuestsResponseDto {
  quests: Quest[];
}

export interface GetUserQuestsProgressResponseDto {
  quests: {
    statistics: {
      progress: {
        quest: {
          [title: string]: { current: number; quest: Quest };
        };
      };
    };
  };
}
