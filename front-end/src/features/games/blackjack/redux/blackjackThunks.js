import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GAME_TYPE,
  SET_DECK,
  SET_CARDS,
  SET_SCORE,
  SET_BET,
  SET_STREAK,
  SET_WINNER,
  SET_NATURALS,
  SET_GOT_PERSISTED_DATA,
} from "./blackjackSlice";

// *API Services Imports*
import {
  getCurrentGameData,
  updateCurrentGameData,
} from "../../general/api_services/persistCurrentGameData";
import updateUserWinsAndBalance from "../../general/api_services/updateUserWinsAndBalance";

// Gets persisted game session.
const getCurrentGameDataThunk = createAsyncThunk(
  "blackjack/persistCurrentGameData/get",
  async (payload, thunkAPI) => {
    const res = await getCurrentGameData(payload.uid, payload.game);

    if (res) {
      if (res.status === 201) {
        // If the persisted data was just initially set, show the modal.
        payload.setShowMatchOrForFunModal((prev) => ({
          ...prev,
          gameStart: true,
        }));
      } else if (Object.keys(res.data.game.blackjack).length) {
        thunkAPI.dispatch(
          GAME_TYPE(res.data.game.blackjack.game_type.toLowerCase())
        );
        thunkAPI.dispatch(SET_DECK(res.data.game.blackjack.deck));
        thunkAPI.dispatch(
          SET_CARDS({
            playerCards: res.data.game.blackjack.player.cards,
            dealerCards: res.data.game.blackjack.dealer.cards,
          })
        );
        thunkAPI.dispatch(
          SET_SCORE({
            playerScore: res.data.game.blackjack.player.score,
            dealerFaceDownScore: res.data.game.blackjack.dealer.face_down_score,
            dealerScore: res.data.game.blackjack.dealer.score,
          })
        );
        res.data.game.blackjack.game_type !== "Fun" &&
          thunkAPI.dispatch(SET_BET(res.data.game.blackjack.player.bet));
        thunkAPI.dispatch(
          SET_STREAK(res.data.game.blackjack.player.win_streak)
        );
        if (res.data.game.blackjack.winner) {
          thunkAPI.dispatch(SET_WINNER(res.data.game.blackjack.winner));
        } else {
          thunkAPI.dispatch(
            SET_NATURALS({
              dealerHasNatural: res.data.game.blackjack.dealer.has_natural,
              playerHasNatural: res.data.game.blackjack.player.has_natural,
            })
          );
          res.data.game.blackjack.game_type !== "Fun" &&
            payload.setCache((prev) => ({
              ...prev,
              userProfile: {
                ...prev.userProfile,
                balance:
                  prev.userProfile.balance - res.data.game.blackjack.player.bet,
              },
            }));
        }

        thunkAPI.dispatch(SET_GOT_PERSISTED_DATA(true));
      } else {
        // When the data that is received is just the initially set data, show the modal.
        payload.setShowMatchOrForFunModal((prev) => ({
          ...prev,
          gameStart: true,
        }));
      }
    }
  }
);

// Persists current game session.
const updateCurrentGameDataThunk = createAsyncThunk(
  "blackjack/persistCurrentGameData/patch",
  async (payload) => {
    await updateCurrentGameData(
      payload.gameData,
      payload.uid,
      payload.csrfToken
    );
  }
);

// Updates user's wins and balance in the db.
const updateUserWinsAndBalanceThunk = createAsyncThunk(
  "blackjack/updateUserWinsAndBalance",
  async (payload) => {
    await updateUserWinsAndBalance(
      payload.uid,
      payload.winner !== "dealer" ? true : false,
      payload.game,
      payload.balance,
      payload.csrfToken
    );
  }
);

export {
  getCurrentGameDataThunk,
  updateCurrentGameDataThunk,
  updateUserWinsAndBalanceThunk,
};
