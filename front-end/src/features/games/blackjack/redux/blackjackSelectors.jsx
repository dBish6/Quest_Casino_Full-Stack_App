// Allows to select a state from the store.
export const selectDeck = (store) => store.blackjack.deck;
export const selectPlayerCards = (store) => store.blackjack.playerCards;
export const selectPlayerScore = (store) => store.blackjack.playerScore;
export const selectDealerCards = (store) => store.blackjack.dealerCards;
export const selectDealerScore = (store) => store.blackjack.dealerScore;
