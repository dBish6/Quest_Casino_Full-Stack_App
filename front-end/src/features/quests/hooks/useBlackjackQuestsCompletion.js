/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *Utility Import*
import quests from "../staticQuests";

// *API Services Import*
import PostCompletedQuest from "../api_services/PostCompletedQuest";

// *Redux Imports*
import { useSelector } from "react-redux";
import {
  selectUpdatedBalance,
  selectGameType,
  selectStreak,
  selectPlayerScore,
  selectWinner,
} from "../../games/blackjack/redux/blackjackSelectors";

const useBlackjackQuestsCompletion = (currentUser) => {
  const updatedBalance = useSelector(selectUpdatedBalance);
  const gameType = useSelector(selectGameType);
  const winStreak = useSelector(selectStreak);
  const { balance, setBalance, completedQuests, setCompletedQuests } =
    useAuth();

  const playerScore = useSelector(selectPlayerScore);
  const winner = useSelector(selectWinner);

  const {
    handleCompletedQuest,
    loading: completedQuestLoading,
    abortController: postAbortController,
  } = PostCompletedQuest(currentUser.uid);

  useEffect(() => {
    console.log("updatedBalance", updatedBalance);
    if (gameType === "Match" && !completedQuestLoading && updatedBalance) {
      let questTitle = undefined;
      let questReward = undefined;
      if (
        winStreak >= 12 &&
        (completedQuests === null ||
          !completedQuests.includes(quests.onARole.title))
      ) {
        // When "On a Role" quest is completed.
        questTitle = quests.onARole.title;
        questReward = quests.onARole.reward;
      } else if (
        playerScore === 21 &&
        winner === currentUser.displayName &&
        (completedQuests === null ||
          !completedQuests.includes(quests.beginnersLuck.title))
      ) {
        // When "Beginner's Luck" quest is completed.
        questTitle = quests.beginnersLuck.title;
        questReward = quests.beginnersLuck.reward;
      }

      // Saves to db and adds to redux.
      questTitle &&
        questTitle &&
        handleCompletedQuest(questTitle, balance, questReward).then(() => {
          //   dispatch(SET_COMPLETED_QUESTS({ quest: questTitle }));
          // dispatch(SET_WALLET(wallet + questReward));
          !completedQuests
            ? setCompletedQuests([questTitle])
            : setCompletedQuests([...completedQuests, questTitle]);
          setBalance(balance + questReward);
        });

      return () => postAbortController.abort();
    }
  }, [updatedBalance]);

  return completedQuestLoading;
};

export default useBlackjackQuestsCompletion;
