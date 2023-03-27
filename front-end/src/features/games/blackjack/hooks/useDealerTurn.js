/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import {
  DEALER_HIT,
  DEALER_TURN,
  SET_DEALER_STANDING,
} from "../redux/blackjackSlice";
import {
  selectDealerScore,
  selectDealerCards,
  selectDealerStanding,
  selectPlayerStanding,
  selectWinner,
} from "../redux/blackjackSelectors";

const useDealerTurn = () => {
  const dispatch = useDispatch();
  const dealerScore = useSelector(selectDealerScore);
  const dealerCards = useSelector(selectDealerCards);
  const dealerStanding = useSelector(selectDealerStanding);
  const playerStanding = useSelector(selectPlayerStanding);
  const winner = useSelector(selectWinner);

  // To un-disable player buttons when player stands; disables by dealers turn.
  useEffect(() => {
    if (winner && playerStanding) dispatch(DEALER_TURN(false));
  }, [winner]);

  const dealerTurn = () => {
    if (dealerScore <= 16 || dealerCards.length === 2) {
      !dealerStanding && dispatch(DEALER_HIT());
      // Dealer cannot stand if he has his face down card. Only if he has blackjack his turn can end on 2 cards.
    } else if (dealerCards.length !== 2 || dealerScore >= 21) {
      winner === null && dispatch(SET_DEALER_STANDING(true));
    }

    if (!playerStanding) dispatch(DEALER_TURN(false));
  };

  return dealerTurn;
};

export default useDealerTurn;
