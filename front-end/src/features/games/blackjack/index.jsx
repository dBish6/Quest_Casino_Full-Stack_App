// *Design Imports*
import { chakra, Box, Image } from "@chakra-ui/react";
import tableImg from "./assets/images/Blackjack_Table_AdobeStock.jpeg";

// *Redux Imports*
// import { useDispatch, useSelector } from "react-redux";
// import {
//   START_GAME,
//   DEALER_DEAL,
//   DEALER_SHUFFLE,
//   PLAYER_HIT,
//   UPDATE_SCORE,
// } from "./redux/blackjackSlice";
//import { selectDeck } from "./redux/blackjackSelectors";

// *Component Imports*
import Interface from "./components/Interface";
import DealerHand from "./components/DealerHand";
import PlayerHand from "./components/PlayerHand";

const BlackjackFeature = () => {
  return (
    <chakra.main>
      {/* Table */}
      <Box>
        <Image src={tableImg} position="absolute" zIndex="-1" />
        <DealerHand />
        <PlayerHand />
      </Box>
      <Interface />
    </chakra.main>
  );
};

export default BlackjackFeature;
