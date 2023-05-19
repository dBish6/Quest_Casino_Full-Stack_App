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
  const {
    balance,
    setBalance,
    completedQuests,
    setCompletedQuests,
    csrfToken,
  } = useAuth();

  const playerScore = useSelector(selectPlayerScore);
  const winner = useSelector(selectWinner);

  const {
    handleCompletedQuest,
    loading: completedQuestLoading,
    abortController: postAbortController,
  } = PostCompletedQuest();

  useEffect(() => {
    if (gameType === "Match" && !completedQuestLoading && updatedBalance) {
      let questTitle = undefined;
      let questReward = undefined;
      if (
        winStreak >= 12 &&
        (completedQuests === null || !completedQuests.includes(quests[1].title))
      ) {
        // When "On a Role" quest is completed.
        questTitle = quests[1].title;
        questReward = quests[1].reward;
      } else if (
        playerScore === 21 &&
        winner === currentUser.displayName &&
        (completedQuests === null || !completedQuests.includes(quests[0].title))
      ) {
        // When "Beginner's Luck" quest is completed.
        questTitle = quests[0].title;
        questReward = quests[0].reward;
      }

      // Saves to db and adds to redux.
      questTitle &&
        questTitle &&
        handleCompletedQuest(
          currentUser.uid,
          questTitle,
          balance,
          questReward,
          csrfToken
        ).then(() => {
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
