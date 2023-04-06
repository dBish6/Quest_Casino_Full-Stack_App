import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

// *Utility Import*
import createDeck from "../utils/createDeck";
import checkCard from "../utils/checkCard";

// *API Services Imports*
import updateWinsBalance from "../../general/api_services/updateWinsBalance";

export const updateWinsBalanceThunk = createAsyncThunk(
  "blackjack/updateWinsBalance",
  async (payload, thunkAPI) => {
    console.log("payload", payload);
    const res = await updateWinsBalance(
      payload.uid,
      payload.winner !== "dealer" ? true : false,
      payload.game,
      payload.balance
    );
    if (res.status === 200) return res.data;
  }
);

const blackjackSlice = createSlice({
  name: "blackjack",
  initialState: {
    gameType: null,
    deck: createDeck(),

    dealerCards: [],
    dealerFaceDownScore: 0,
    dealerScore: 0,
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
    balanceLoading: false,
    updatedBalance: false,

    winner: null,
  },
  reducers: {
    CLEAR_GAME: (state) => {
      state.gameType = null;
      state.dealerCards = [];
      state.dealerFaceDownScore = 0;
      state.dealerScore = 0;
      state.dealerTurn = false;
      state.dealerStanding = false;
      state.playerCards = [];
      state.playerBet = 0;
      state.playerScore = 0;
      state.playerInitialHit = false;
      state.playerStanding = false;
      state.winner = null;
    },
    GAME_TYPE: (state, action) => {
      state.gameType = action.payload;
    },
    START_GAME: (state) => {
      state.winner = null;

      state.deck = createDeck();
      state.dealerCards = [];
      state.dealerScore = 0;
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
    DEALER_DEAL: (state) => {
      // Deals cards to the player and dealer and ensures the cards are dealt in the right order.
      state.playerCards = [state.deck.pop()];
      state.dealerCards = [state.deck.pop()];
      state.playerCards = [...state.playerCards, state.deck.pop()];
      state.dealerCards = [...state.dealerCards, state.deck.pop()];
    },
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
    SET_COMPLETED_QUESTS: (state, action) => {
      if (action.payload.quest) {
        if (state.completedQuests === null) {
          state.completedQuests = [action.payload.quest];
        } else {
          state.completedQuests.push(action.payload.quest);
        }
      } else {
        state.completedQuests = action.payload.quests;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateWinsBalanceThunk.pending, (state) => {
      state.balanceLoading = true;
    });
    builder.addCase(updateWinsBalanceThunk.fulfilled, (state) => {
      state.balanceLoading = false;
      state.updatedBalance = true;
    });
    builder.addCase(updateWinsBalanceThunk.rejected, (state, action) => {
      state.balanceLoading = false;
      console.error(action.error.message);
    });
  },
});

// Action creators are generated for each case reducer function.
export const {
  CLEAR_GAME,
  GAME_TYPE,
  SET_COMPLETED_QUESTS,
  START_GAME,
  UPDATE_SCORE,
  DETERMINE_WINNER,
  DEALER_DEAL,
  DEALER_SHUFFLE,
  DEALER_HIT,
  DEALER_TURN,
  SET_DEALER_STANDING,
  SET_BET,
  PLAYER_HIT,
  DOUBLE_DOWN,
  SET_PLAYER_STANDING,
} = blackjackSlice.actions;
// Exports the slice's reducer.
export default blackjackSlice.reducer;
