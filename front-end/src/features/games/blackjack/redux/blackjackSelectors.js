// Allows to select a state from the store.
export const selectGameType = (store) => {
  let gameType = store.blackjack.gameType;
  if (gameType !== null)
    return gameType.charAt(0).toUpperCase() + gameType.slice(1);
};
// Dealer Selectors
export const selectDeck = (store) => store.blackjack.deck;
export const selectDealerCards = (store) => store.blackjack.dealerCards;
export const selectDealerFaceDownScore = (store) =>
  store.blackjack.dealerFaceDownScore;
export const selectDealerScore = (store) => store.blackjack.dealerScore;
export const selectDealerTurn = (store) => store.blackjack.dealerTurn;
export const selectDealerStanding = (store) => store.blackjack.dealerStanding;
// Player Selectors
export const selectPlayerCards = (store) => store.blackjack.playerCards;
export const selectPlayerScore = (store) => store.blackjack.playerScore;
export const selectPlayerBet = (store) => store.blackjack.playerBet;
export const selectPlayerInitialHit = (store) =>
  store.blackjack.playerInitialHit;
export const selectPlayerStanding = (store) => store.blackjack.playerStanding;
export const selectHasBlackjackOnFirstTurn = (store) =>
  store.blackjack.hasBlackjackOnFirstTurn;
export const selectWallet = (store) => store.blackjack.wallet;
export const selectWinner = (store) => store.blackjack.winner;
