import { useState, useEffect } from "react";

// *Design Imports*
import { ButtonGroup, Button } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Custom Hooks Imports*
import useStartGame from "../../hooks/useStartGame";

// *Redux Imports*
import { useDispatch } from "react-redux";
import { SET_BET, DEALER_DEAL } from "../../redux/blackjackSlice";

const BettingButtons = (props) => {
  const [bet, setBet] = useState({
    count: 0,
    multiplierIndex: 0,
    multiplier: 5,
  });
  const BET_MULTIPLIERS = [5, 10, 15, 25, 50, 100];

  const [betText, setBetText] = useState(false);

  const dispatch = useDispatch();
  const startGame = useStartGame();

  useEffect(() => {
    const wait = () => {
      if (props.winner !== null && bet.count === 0) {
        setBetText("Updating Balance...");
        setTimeout(() => {
          setBetText(`Bet: $${bet.count}`);
        }, 2760);
      } else {
        setBetText(`Bet: $${bet.count}`);
      }
    };
    wait();
  }, [props.winner, bet.count]);

  return (
    <AnimatePresence>
      <ButtonGroup
        isDisabled={props.isDealerTurn || betText === "Updating Balance..."}
        position="relative"
        minW="255px"
      >
        <Button
          onClick={() => {
            const newCount = bet.count + bet.multiplier;
            const maxCount = (props.wallet / bet.multiplier) * bet.multiplier;
            newCount <= 1000
              ? setBet((prev) => ({
                  ...prev,
                  count: newCount > maxCount ? maxCount : newCount,
                }))
              : setBet((prev) => ({
                  ...prev,
                  count: 1000,
                }));
          }}
          variant="blackjackBlue"
          w={bet.count > 0 ? "100%" : "154.883px"}
          zIndex="1"
        >
          {betText}
        </Button>

        <Button
          onClick={() => {
            setBet((prev) => ({
              ...prev,
              multiplierIndex:
                (prev.multiplierIndex + 1) % BET_MULTIPLIERS.length,
            }));
            setBet((prev) => ({
              ...prev,
              multiplier: BET_MULTIPLIERS[prev.multiplierIndex],
            }));
          }}
          variant="transparency"
          position="absolute"
          bottom="33px"
          left="117px"
          h="fit-content"
          p="0.5rem"
        >
          x{BET_MULTIPLIERS[bet.multiplierIndex]}
        </Button>

        {bet.count > 0 && (
          <Button
            onClick={() => {
              dispatch(SET_BET(bet.count));
              startGame();
              dispatch(DEALER_DEAL());
            }}
            variant="blackjackGreen"
            w="55%"
            zIndex="1"
          >
            Place Bet
          </Button>
        )}
      </ButtonGroup>
    </AnimatePresence>
  );
};

export default BettingButtons;
