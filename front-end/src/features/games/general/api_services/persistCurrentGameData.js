import axios from "axios";
import apiURL from "../../../../apiUrl";

import { createStandaloneToast } from "@chakra-ui/toast";
const { toast } = createStandaloneToast();

const getCurrentGameData = async (uid, game) => {
  const abortController = new AbortController();

  try {
    const res = await axios({
      method: "GET",
      url: `${apiURL}/games/api/firebase/session?uid=${uid}&game=${game}`,
      withCredentials: true,
      signal: abortController.signal,
      validateStatus: (status) => {
        return status === 200 || status === 201 || status === 429;
      },
    });
    // console.log("GET", res.data);

    return res;
  } catch (error) {
    errorConditions(error, "get");
    abortController.abort();
  }
};

const updateCurrentGameData = async (gameData, uid, csrfToken) => {
  let sessionData;
  const abortController = new AbortController();

  try {
    if (gameData.game === "blackjack") {
      sessionData = {
        deck: gameData.deck,
        gameType: gameData.gameType,
        dealer: {
          cards: gameData.dealerCards,
          faceDownScore: gameData.dealerFaceDownScore,
          score: gameData.dealerScore,
          hasNatural: gameData.dealerHasNatural,
        },
        player: {
          cards: gameData.playerCards,
          score: gameData.playerScore,
          bet: gameData.playerBet,
          hasNatural: gameData.playerHasNatural,
          winStreak: gameData.winStreak,
        },
        winner: gameData.winner,
      };
    }

    const res = await axios({
      method: "PATCH",
      url: `${apiURL}/games/api/firebase/session?uid=${uid}&game=${gameData.game}`,
      data: sessionData,
      headers: {
        CSRF_Token: csrfToken,
      },
      withCredentials: true,
      signal: abortController.signal,
      validateStatus: (status) => {
        return status === 200 || status === 429;
      },
    });
    // console.log("POST", res.data);

    return res;
  } catch (error) {
    errorConditions(error, "post");
    abortController.abort();
  }
};

const navigate = (page) => {
  const pathname =
    window.location.hostname === "localhost"
      ? `${window.location.hostname}:3000/${page}`
      : `${window.location.hostname}/${page}`;
  window.location = `${window.location.protocol}//${pathname}`;
};

const errorConditions = (error, type) => {
  if (error.code === "ECONNABORTED" || error.message === "canceled") {
    console.warn("Request was aborted.");
  } else if (error.response && error.response.status === 401) {
    console.error(error);
    navigate("error401");
  } else {
    console.error(error);
    if (type === "post") {
      toast({
        description:
          "Server Error 500: Failed to update current game session. Data isn't saved, proceed with caution. If the issue persists, please contact support for further assistance.",
        status: "error",
        duration: 99999999,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    } else {
      navigate("error500");
    }
  }
};

export { getCurrentGameData, updateCurrentGameData };
