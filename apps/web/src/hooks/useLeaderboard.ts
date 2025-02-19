import { useContext } from "react";
import { LeaderboardContext } from "@gameFeat/components/modals/menu/slides";

export default function useLeaderboard() {
  const context = useContext(LeaderboardContext);
  if (!context)
    throw new Error("useLeaderboard must be used within a LeaderboardProvider.");

  return context;
}
