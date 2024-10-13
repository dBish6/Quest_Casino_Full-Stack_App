import type { GameStatus, GameCategory } from "@qc/constants";

export default interface Game {
  title: string;
  description: string;
  category: GameCategory;
  image: { src: string; alt: string };
  odds: string;
  origin: string;
  status: GameStatus;
}
