// Allows to select a state from the store.
export const selectGameType = (store) => {
  let gameType = store.blackjack.gameType;
  if (gameType !== null)
    return gameType.charAt(0).toUpperCase() + gameType.slice(1);
};
// Dealer Selectors
export const selectDealerCards = (store) => store.blackjack.dealerCards;
export const selectDealerFaceDownScore = (store) =>
  store.blackjack.dealerFaceDownScore;
export const selectDealerScore = (store) => store.blackjack.dealerScore;
export const selectDealerTurn = (store) => store.blackjack.dealerTurn;
export const selectDealerStanding = (store) => store.blackjack.dealerStanding;
export const selectDealerHasNatural = (store) =>
  store.blackjack.dealerHasNatural;
// Player Selectors
export const selectPlayerCards = (store) => store.blackjack.playerCards;
export const selectPlayerScore = (store) => store.blackjack.playerScore;
export const selectPlayerBet = (store) => store.blackjack.playerBet;
export const selectPlayerInitialHit = (store) =>
  store.blackjack.playerInitialHit;
export const selectPlayerStanding = (store) => store.blackjack.playerStanding;
export const selectPlayerHasNatural = (store) =>
  store.blackjack.playerHasNatural;
export const selectStreak = (store) => store.blackjack.streak;
export const selectWallet = (store) => store.blackjack.wallet;
export const selectBalanceLoading = (store) => store.blackjack.balanceLoading;
export const selectUpdatedBalance = (store) => store.blackjack.updatedBalance;
export const selectCompletedQuests = (store) => store.blackjack.completedQuests;
export const selectWinner = (store) => store.blackjack.winner;
