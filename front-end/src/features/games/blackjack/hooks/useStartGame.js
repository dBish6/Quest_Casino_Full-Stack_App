// *Redux Imports*
import { useDispatch } from "react-redux";
import { START_GAME, DEALER_SHUFFLE } from "../redux/blackjackSlice";

const useStartGame = () => {
  const dispatch = useDispatch();

  const startGame = () => {
    dispatch(START_GAME());
    dispatch(DEALER_SHUFFLE());
  };
  return startGame;
};

export default useStartGame;
