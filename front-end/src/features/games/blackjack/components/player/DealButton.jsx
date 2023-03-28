// *Design Imports*
import { Button } from "@chakra-ui/react";

// *Custom Hooks Imports*
import useStartGame from "../../hooks/useStartGame";

// *Redux Imports*
import { useDispatch } from "react-redux";
import { DEALER_DEAL } from "../../redux/blackjackSlice";

const DealButton = (props) => {
  const dispatch = useDispatch();
  const startGame = useStartGame();

  return (
    <Button
      onClick={() => {
        startGame();
        dispatch(DEALER_DEAL());
      }}
      isDisabled={props.isDealerTurn || props.showcaseRunning}
      variant="blackjackBlue"
      w="235px"
      fontSize="18px"
    >
      Deal
    </Button>
  );
};

export default DealButton;
