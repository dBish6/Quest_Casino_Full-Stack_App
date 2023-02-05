// *Design Imports*
import { chakra, Box, Image, Text, HStack } from "@chakra-ui/react";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import {
  START_GAME,
  DEALER_DEAL,
  DEALER_SHUFFLE,
  PLAYER_HIT,
  UPDATE_SCORE,
} from "../redux/blackjackSlice";
import {
  selectDealerCards,
  selectDealerScore,
} from "../redux/blackjackSelectors";

const DealerHand = () => {
  const dealerCards = useSelector(selectDealerCards);
  const dealerScore = useSelector(selectDealerScore);
  const dispatch = useDispatch();

  // TODO: How we going to know when to deal cards; whenever player does their turn.
  return (
    <Box>
      <button onClick={() => dispatch(DEALER_DEAL())}>Deal</button>
      {dealerCards.length ? (
        <HStack gap="1rem">
          {dealerCards.map((card, i) => {
            return <Image src={card.image} key={i} maxW="180px" minH="261px" />;
          })}
        </HStack>
      ) : (
        <Text>No Cards</Text>
      )}
      <Text>{dealerScore}</Text>
    </Box>
  );
};

export default DealerHand;
