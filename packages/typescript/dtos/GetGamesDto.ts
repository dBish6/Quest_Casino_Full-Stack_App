import type { GameStatus, GameCategory } from "@qc/constants";

export interface Game {
  title: string;
  description: string;
  category: GameCategory;
  image: { src: string; alt: string };
  odds: string;
  origin: string;
  status: GameStatus;
}

export interface GetGamesResponseDto {
  games: Game[];
}
