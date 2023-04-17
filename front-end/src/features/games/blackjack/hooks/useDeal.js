// *Redux Imports*
import { useDispatch } from "react-redux";
import {
  DEAL_A_CARD_PLAYER,
  DEAL_A_CARD_DEALER,
} from "../redux/blackjackSlice";

// Deals cards to the player and dealer and ensures the cards are dealt in the right order.
const useDeal = () => {
  const dispatch = useDispatch();

  const deal = () => {
    dispatch(DEAL_A_CARD_PLAYER());
    setTimeout(() => {
      dispatch(DEAL_A_CARD_DEALER());
    }, 1500);
    setTimeout(() => {
      dispatch(DEAL_A_CARD_PLAYER());
    }, 2500);
    setTimeout(() => {
      dispatch(DEAL_A_CARD_DEALER());
    }, 3500);
  };

  return deal;
};

export default useDeal;
