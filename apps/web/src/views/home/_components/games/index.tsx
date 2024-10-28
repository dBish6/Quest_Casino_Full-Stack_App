import type Game from "@typings/Game";

import { ScrollArea } from "@components/scrollArea";
import GamesDev from "./GamesDev";
import GamesActive from "./GamesActive";

import s from "../../home.module.css";

interface GamesActiveProps {
  status: "active" | "development";
  games: Game[];
  gamesLoading: boolean;
}

export function Games({ status, games, gamesLoading }: GamesActiveProps) {
  const isActive = status === "active";

  return (
    <ScrollArea
      {...(isActive ? { id: "gamesArea", orientation: "vertical" } : { orientation: "horizontal" })}
    >
      <>
        {(() => {
          const gamesToRender: (Game | undefined)[] = gamesLoading
            ? Array.from({ length: status === "active" ? 10 : 3 }) : games;

            return gamesToRender?.length ? (
              <ul
                {...(isActive ? { id: "activeGames" } : { className: s.gamesSoon })}
              >
                {isActive ? <GamesActive games={gamesToRender} /> : <GamesDev games={gamesToRender} />}
              </ul>
            ) : (
              <p>No Results</p>
            );
        })()}
      </>
    </ScrollArea>
  )
}

export { GamesFilters, GamesSearch } from "./GamesActive";
