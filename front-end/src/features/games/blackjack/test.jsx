import { useEffect } from "react";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import {
  START_GAME,
  DEALER_DEAL,
  DEALER_SHUFFLE,
  PLAYER_HIT,
  UPDATE_SCORE,
} from "./redux/blackjackSlice";
import { selectDeck } from "./redux/blackjackSelectors";

const BlackjackFeature = () => {
  const dispatch = useDispatch();
  const deck = useSelector(selectDeck);
  // const [cardIndex, setCardIndex] = useState(0)

  useEffect(() => {
    console.log(deck);
  }, [deck]);

  return (
    <>
      <button onClick={() => dispatch(START_GAME())}>Start New Game</button>
      <br />

      <button onClick={() => dispatch(DEALER_SHUFFLE())}>Shuffle</button>
      <br />

      <button onClick={() => dispatch(DEALER_DEAL())}>Deal Cards</button>
      <br />

      <button onClick={() => dispatch(PLAYER_HIT())}>Player Hit</button>
      <br />

      <button
        onClick={() => dispatch(UPDATE_SCORE({ player: true, wants11: false }))}
      >
        Update Score
      </button>
    </>
  );
};

export default BlackjackFeature;
