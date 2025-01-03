import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { SetStableSearchParams } from "@hooks/useStableSearchParams";
import type { GameDataState } from "../Home";

export default function handleFilterActiveGames(
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLSelectElement>,
  user: UserCredentials | null,
  searchParams: URLSearchParams,
  setStableSearchParams: SetStableSearchParams,
  gameData: GameDataState["active"],
  setGameData: React.Dispatch<React.SetStateAction<GameDataState>>
) {
  const target = e.currentTarget,
    filter = e.currentTarget.value || target.innerText;

  let filteredGames = gameData.searched.length ? gameData.searched : gameData.initial;
  if (filter !== "All") {
    filteredGames = filteredGames.filter((game) =>
      filter === "Favourites"
        ? game.title === (user?.favourites[game.title] || "")
        : game.category === filter.toLowerCase()
    );
    searchParams.set("fil", filter);
  } else {
    searchParams.delete("fil");
  }

  setGameData((prev) => ({
    ...prev,
    active: { ...prev.active, current: filteredGames }
  }));
  setStableSearchParams();
}
