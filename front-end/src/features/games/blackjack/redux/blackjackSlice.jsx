import { createSlice, current } from "@reduxjs/toolkit";

// *Utility Import*
import createDeck from "../utils/createDeck";

const checkCard = (card, wants11) => {
  if (["J", "Q", "K"].includes(card.face)) {
    console.log("yup");
    return 10;
  }
  if (card.face === "A" && !wants11) {
    console.log("yup");
    return 1;
  } else if (card.face === "A" && wants11) {
    console.log("yup");
    return 11;
  }

  return card.face;
};

const blackjackSlice = createSlice({
  name: "blackjack",
  initialState: {
    deck: createDeck(),
    playerCards: [],
    playerScore: 0,
    dealerCards: [],
    dealerScore: 0,
    // bet: 0,
    // wallet: newWallet,
    gameOver: false,
    winner: null,
  },
  reducers: {
    START_GAME: (state) => {
      state.winner = null;
      state.gameOver = false;

      state.deck = createDeck();
      state.dealerCards = [];
      state.playerCards = [];
    },
    DEALER_DEAL: (state) => {
      // Code to deal cards to the player and dealer.
      state.dealerCards = [state.deck.pop(), state.deck.pop()];
      state.playerCards = [state.deck.pop(), state.deck.pop()];
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
    // DEALER_TURN: (state) => {

    // },
    // INCREASE_BET: (state) => {
    //     ...state,
    //     wallet: state.wallet - action.amount,
    //     bet: state.bet + action.amount
    //   },
    // DECREASE_BET: (state) => {
    //     ...state,
    //     wallet: state.wallet + action.amount,
    //     bet: state.bet - action.amount
    // },
    PLAYER_HIT: (state) => {
      // Code to add a card to the player's hand
      state.playerCards.push(state.deck.pop());
    },
    // PLAYER_STAND: (state) => {
    //   // Code to add a card to the player's hand
    // },
    // ALL_IN: (state) => {
    //     ...state,
    //     wallet: 0,
    //     bet: state.bet + state.wallet
    // },
    // CLEAR_BET: (state) => {
    //     ...state,
    //     wallet: state.bet + state.wallet,
    //     bet: 0
    // },
    UPDATE_SCORE: (state, action) => {
      let newScore;
      let cards = action.payload.player ? state.playerCards : state.dealerCards;

      newScore = cards.reduce(
        (total, card) => total + checkCard(card, action.payload.wants11),
        0
      );

      if (action.payload.player) {
        state.playerScore = newScore;
      } else {
        state.dealerScore = newScore;
      }
    },
    DETERMINE_WINNER: (state, action) => {
      state.winner = action.payload;
      state.gameOver = true;
    },
  },
});

// Action creators are generated for each case reducer function.
export const {
  START_GAME,
  DEALER_DEAL,
  DEALER_SHUFFLE,
  // DEALER_TURN,
  PLAYER_HIT,
  // PLAYER_STAND,
  UPDATE_SCORE,
  DETERMINE_WINNER,
} = blackjackSlice.actions;
// Exports the slice's reducer.
export default blackjackSlice.reducer;
