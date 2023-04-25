import { useState } from "react";

// *Design Imports*
import { ButtonGroup, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import fadeInAnimations from "../../../general/utils/animations/fadeIn";

// *Custom Hooks Imports*
import useStartGame from "../../hooks/useStartGame";
import useDeal from "../../hooks/useDeal";

// *Redux Imports*
import { useDispatch } from "react-redux";
import { SET_BET } from "../../redux/blackjackSlice";

const BettingButtons = (props) => {
  const { fadeInVar2 } = fadeInAnimations(0.9, 0.2);
  const [bet, setBet] = useState({
    count: 0,
    multiplierIndex: 0,
    multiplier: 5,
  });
  const BET_MULTIPLIERS = [5, 10, 15, 25, 50, 100];

  const dispatch = useDispatch();
  const startGame = useStartGame();
  const deal = useDeal();

  return (
    <ButtonGroup
      as={motion.div}
      variants={fadeInVar2}
      initial="hidden"
      animate="visible"
      isDisabled={
        props.isDealerTurn ||
        props.showcaseRunning ||
        props.balanceLoading ||
        props.completedQuestLoading ||
        props.balance === null
      }
      position="relative"
      minW="255px"
    >
      <Button
        onClick={() => {
          const newCount = bet.count + bet.multiplier;
          const maxCount = (props.balance / bet.multiplier) * bet.multiplier;
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
        {props.balanceLoading || props.completedQuestLoading
          ? "Updating Balance..."
          : props.balance === null
          ? "Loading Balance..."
          : `Bet: $${bet.count}`}
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
          as={motion.button}
          variants={fadeInVar2}
          initial="hidden"
          animate="visible"
          onClick={() => {
            dispatch(SET_BET(bet.count));
            props.gameType === "Match" &&
              props.setBalance(props.balance - bet.count);
            new Promise((resolve) => {
              if (props.playerCards.length > 0) {
                startGame();
                // Waits for card exit animation.
                setTimeout(() => {
                  resolve();
                }, 1280);
              } else {
                resolve(startGame());
              }
            }).then(() => deal());
          }}
          variant="blackjackGreen"
          w="55%"
          zIndex="1"
        >
          Place Bet
        </Button>
      )}
    </ButtonGroup>
  );
};

export default BettingButtons;
