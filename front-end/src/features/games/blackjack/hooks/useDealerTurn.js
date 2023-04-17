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
  selectDealerCards,
  selectDealerScore,
  selectDealerStanding,
  selectPlayerScore,
  selectPlayerHasNatural,
  selectWinner,
} from "../redux/blackjackSelectors";

const useDealerTurn = () => {
  const dispatch = useDispatch();
  const dealerCards = useSelector(selectDealerCards);
  const dealerScore = useSelector(selectDealerScore);
  const dealerStanding = useSelector(selectDealerStanding);
  const playerScore = useSelector(selectPlayerScore);
  const playerHasNatural = useSelector(selectPlayerHasNatural);
  const winner = useSelector(selectWinner);

  // To un-disable player buttons.
  useEffect(() => {
    if (winner !== null) {
      dispatch(DEALER_TURN(false));
    }
  }, [winner]);

  const dealerTurn = () => {
    if (
      dealerScore <= 16 ||
      (dealerCards.length === 2 && dealerScore !== 21) ||
      (playerScore === 21 && !playerHasNatural && dealerScore < 21)
    ) {
      !dealerStanding && dispatch(DEALER_HIT());

      // Dealer cannot stand if he has his face down card. Only if he has blackjack his turn can end on 2 cards.
    } else if (
      dealerCards.length !== 2 &&
      dealerScore >= 17 &&
      dealerScore < 21
    ) {
      dispatch(SET_DEALER_STANDING(true));
    }
  };

  return dealerTurn;
};

export default useDealerTurn;
