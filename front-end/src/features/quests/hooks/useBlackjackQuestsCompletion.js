/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

// *Custom Hooks Import*
import useCache from "../../../hooks/useCache";

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

const useBlackjackQuestsCompletion = (currentUser, csrfToken) => {
  const updatedBalance = useSelector(selectUpdatedBalance);
  const gameType = useSelector(selectGameType);
  const winStreak = useSelector(selectStreak);
  const { cache, setCache } = useCache();

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
        (cache.userProfile.completed_quests === null ||
          !cache.userProfile.completed_quests.includes(quests[1].title))
      ) {
        // When "On a Role" quest is completed.
        questTitle = quests[1].title;
        questReward = quests[1].reward;
      } else if (
        playerScore === 21 &&
        winner === currentUser.displayName &&
        (cache.userProfile.completed_quests === null ||
          !cache.userProfile.completed_quests.includes(quests[0].title))
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
          cache.userProfile.balance,
          questReward,
          csrfToken
        ).then(() => {
          setCache((prev) => ({
            ...prev,
            userProfile: {
              ...prev.userProfile,
              balance: prev.userProfile.balance + questReward,
              completed_quests: [
                ...prev.userProfile.completed_quests,
                questTitle,
              ],
            },
          }));
        });

      return () => postAbortController.abort();
    }
  }, [updatedBalance]);

  return completedQuestLoading;
};

export default useBlackjackQuestsCompletion;
