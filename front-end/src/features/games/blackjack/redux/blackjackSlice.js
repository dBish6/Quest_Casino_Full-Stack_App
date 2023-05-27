import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentGameDataThunk,
  updateCurrentGameDataThunk,
  updateUserWinsAndBalanceThunk,
} from "./blackjackThunks";

// *Utility Imports*
import createDeck from "../utils/createDeck";
import checkCard from "../utils/checkCard";

const initialState = {
  gameType: null,
  deck: createDeck(),

  dealerCards: [],
  dealerFaceDownScore: 0,
  dealerScore: 0,
  dealerDealt: false,
  dealerTurn: false,
  dealerStanding: false,
  dealerHasNatural: false,

  playerCards: [],
  playerBet: 0,
  playerScore: 0,
  playerInitialHit: false,
  playerStanding: false,
  playerHasNatural: false,
  streak: 0,
  winner: null,

  persisterLoading: { get: true, patch: false },
  gotPersistedData: false,

  balanceLoading: false,
  updatedBalance: false,
};

const blackjackSlice = createSlice({
  name: "blackjack",
  initialState,
  reducers: {
    FULL_CLEAR: () => initialState,

    GAME_TYPE: (state, action) => {
      state.gameType = action.payload;
    },
    START_GAME: (state) => {
      state.winner = null;

      state.deck = createDeck();
      state.dealerCards = [];
      state.dealerScore = 0;
      state.dealerDealt = false;
      state.dealerStanding = false;
      state.dealerHasNatural = false;

      state.playerCards = [];
      state.playerScore = 0;
      state.playerInitialHit = false;
      state.playerStanding = false;
      state.playerHasNatural = false;
      state.updatedBalance = false;
    },
    UPDATE_SCORE: (state, action) => {
      let newFaceDownScore;
      let newScore;
      let cards;

      if (action.payload.player) {
        cards = state.playerCards;
        if (cards.length === 2) {
          const twoAcesOnFirstTurn =
            cards[0].face === "A" && cards[1].face === "A";
          if (
            // Automatically when the player gets a 10 card and ace in their hand.
            (["J", "Q", "K"].includes(cards[0].face) &&
              cards[1].face === "A") ||
            (cards[0].face === "A" && ["J", "Q", "K"].includes(cards[1].face))
          ) {
            state.playerHasNatural = true;
            newScore = 21;
          } else if (twoAcesOnFirstTurn) {
            state.playerScore += action.payload.wants11;
          } else {
            newScore = cards.reduce(
              (total, card) => total + checkCard(card, action.payload.wants11),
              0
            );
          }

          if (!twoAcesOnFirstTurn) state.playerScore = newScore;
        } else {
          state.playerScore += checkCard(
            cards[cards.length - 1],
            action.payload.wants11
          );
        }
      } else if (!action.payload.player) {
        cards = state.dealerCards;
        if (state.dealerCards.length === 2) {
          if (
            (["J", "Q", "K"].includes(cards[0].face) &&
              cards[1].face === "A") ||
            (cards[0].face === "A" && ["J", "Q", "K"].includes(cards[1].face))
          ) {
            state.dealerHasNatural = true;
            newScore = 21;
          } else {
            // When the dealer has his second card face down.
            newFaceDownScore = checkCard(cards[0], action.payload.wants11);
            state.dealerFaceDownScore = newFaceDownScore;
          }
        }
        if (newScore !== 21)
          newScore = cards.reduce(
            (total, card) => total + checkCard(card, action.payload.wants11),
            0
          );

        state.dealerScore = newScore;
      }
    },
    DETERMINE_WINNER: (state, action) => {
      // *When in Play*
      if (state.dealerScore === 21 && state.playerScore === 21) {
        // If both the dealer and the player get a blackjack.
        state.winner = "push";
      } else if (state.playerScore === 21) {
        // If player has blackjack.
        if (state.gameType === "match") state.streak += 1;
        state.winner = action.payload.displayName;
      } else if (state.dealerScore === 21) {
        // If dealer has blackjack.
        if (state.gameType === "match") state.streak = 0;

        state.winner = "dealer";
      } else if (state.playerScore > 21) {
        // If player busts.
        if (state.gameType === "match") state.streak = 0;
        state.winner = "dealer";
      } else if (state.dealerScore > 21) {
        // If dealer busts.
        if (state.gameType === "match") state.streak += 1;
        state.winner = action.payload.displayName;
      }
      // *When All Standing*
      else if (
        state.dealerStanding &&
        state.playerStanding &&
        state.dealerScore > state.playerScore
      ) {
        // If dealer has the higher score.
        if (state.gameType === "match") state.streak = 0;
        state.winner = "dealer";
      } else if (
        state.dealerStanding &&
        state.playerStanding &&
        state.playerScore > state.dealerScore
      ) {
        // If player has the higher score.
        if (state.gameType === "match") state.streak += 1;
        state.winner = action.payload.displayName;
      } else if (
        state.dealerStanding &&
        state.playerStanding &&
        state.dealerScore === state.playerScore
      ) {
        // If both the player and the dealer have the same score.
        state.winner = "push";
      }
    },

    // *Dealer*
    DEALER_SHUFFLE: (state) => {
      // Fisher-Yates shuffle algorithm.
      for (let i = state.deck.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let temp = state.deck[i];
        // Swaps two cards between the current index and the random index.
        state.deck[i] = state.deck[randomIndex];
        state.deck[randomIndex] = temp;
      }
    },
    DEAL_A_CARD_PLAYER: (state) => {
      state.playerCards = [...state.playerCards, state.deck.pop()];
    },
    DEAL_A_CARD_DEALER: (state) => {
      state.dealerCards = [...state.dealerCards, state.deck.pop()];
    },
    DEALER_DEALT: (state) => {
      state.dealerDealt = true;
    },
    DEALER_HIT: (state) => {
      state.dealerCards.push(state.deck.pop());
    },
    DEALER_TURN: (state, action) => {
      state.dealerTurn = action.payload;
    },
    SET_DEALER_STANDING: (state, action) => {
      state.dealerStanding = action.payload;
    },

    // *Player*
    SET_BET: (state, action) => {
      state.playerBet = action.payload;
    },
    PLAYER_HIT: (state) => {
      state.playerInitialHit = true;
      state.playerCards.push(state.deck.pop());
    },
    DOUBLE_DOWN: (state) => {
      state.playerBet += state.playerBet;
    },
    SET_PLAYER_STANDING: (state, action) => {
      state.playerStanding = action.payload;
    },
    SET_NATURALS: (state, action) => {
      state.dealerHasNatural = action.payload.dealerHasNatural;
      state.playerHasNatural = action.payload.playerHasNatural;
    },

    // *For Get Persister*
    SET_DECK: (state, action) => {
      state.deck = action.payload;
    },
    SET_CARDS: (state, action) => {
      state.playerCards = action.payload.playerCards;
      state.dealerCards = action.payload.dealerCards;
    },
    SET_STREAK: (state, action) => {
      state.streak = action.payload;
    },
    SET_SCORE: (state, action) => {
      state.playerScore = action.payload.playerScore;
      state.dealerFaceDownScore = action.payload.dealerFaceDownScore;
      state.dealerScore = action.payload.dealerScore;
    },
    SET_WINNER: (state, action) => {
      state.winner = action.payload;
    },
    SET_GOT_PERSISTED_DATA: (state, action) => {
      state.gotPersistedData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrentGameDataThunk.fulfilled, (state) => {
      state.persisterLoading.get = false;
    });
    builder.addCase(getCurrentGameDataThunk.rejected, (state, action) => {
      state.persisterLoading.get = false;
      console.error(action.error.message);
    });

    builder.addCase(updateCurrentGameDataThunk.pending, (state) => {
      state.persisterLoading.patch = true;
    });
    builder.addCase(updateCurrentGameDataThunk.fulfilled, (state) => {
      state.persisterLoading.patch = false;
    });
    builder.addCase(updateCurrentGameDataThunk.rejected, (state, action) => {
      state.persisterLoading.patch = false;
      console.error(action.error.message);
    });

    builder.addCase(updateUserWinsAndBalanceThunk.pending, (state) => {
      state.balanceLoading = true;
    });
    builder.addCase(updateUserWinsAndBalanceThunk.fulfilled, (state) => {
      state.balanceLoading = false;
      state.updatedBalance = true;
    });
    builder.addCase(updateUserWinsAndBalanceThunk.rejected, (state, action) => {
      state.balanceLoading = false;
      console.error(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function.
export const {
  FULL_CLEAR,
  GAME_TYPE,
  START_GAME,
  SET_DECK,
  SET_CARDS,
  SET_SCORE,
  SET_NATURALS,
  SET_GOT_PERSISTED_DATA,
  UPDATE_SCORE,
  DETERMINE_WINNER,
  SET_WINNER,
  DEALER_SHUFFLE,
  DEAL_A_CARD_PLAYER,
  DEAL_A_CARD_DEALER,
  DEALER_DEALT,
  DEALER_HIT,
  DEALER_TURN,
  SET_DEALER_STANDING,
  SET_BET,
  PLAYER_HIT,
  DOUBLE_DOWN,
  SET_PLAYER_STANDING,
  SET_STREAK,
} = blackjackSlice.actions;
// Exports the slice's reducer.
export default blackjackSlice.reducer;
