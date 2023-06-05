import { useState } from "react";

// *Design Imports*
import { ButtonGroup, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import fadeInAnimations from "../../../general/utils/animations/fadeIn";

// *Custom Hooks Imports*
import useStartGame from "../../hooks/useStartGame";
import useDeal from "../../hooks/useDeal";

// *Redux Imports*
import { SET_BET } from "../../redux/blackjackSlice";

const BettingButtons = (props) => {
  const { fadeInVar2 } = fadeInAnimations(0.9, 0.2),
    [previousBets, setPreviousBets] = useState([]),
    [bet, setBet] = useState({
      count: 0,
      multiplierIndex: 0,
      multiplier: 5,
    }),
    BET_MULTIPLIERS = [5, 10, 15, 25, 50, 100];

  const startGame = useStartGame(),
    deal = useDeal();

  return (
    <ButtonGroup
      aria-label="Action Buttons"
      as={motion.div}
      variants={fadeInVar2}
      initial="hidden"
      animate="visible"
      isDisabled={
        props.isDealerTurn ||
        props.showcaseRunning ||
        (props.persisterLoading.patch && props.winner) ||
        props.balanceLoading ||
        props.completedQuestLoading ||
        props.cache.userProfile.balance <= 5
      }
      position="relative"
      minW="255px"
    >
      <Button
        onClick={() => {
          const newCount = bet.count + bet.multiplier;
          const maxCount =
            (props.cache.userProfile.balance / bet.multiplier) * bet.multiplier;
          newCount <= 1000
            ? setBet((prev) => {
                newCount <= maxCount &&
                  setPreviousBets((prevPreviousBets) => [
                    ...prevPreviousBets,
                    prev.count,
                  ]);
                return {
                  ...prev,
                  count: newCount > maxCount ? maxCount : newCount,
                };
              })
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
          : props.persisterLoading.patch && props.winner
          ? "Saving Data..."
          : props.cache.userProfile.balance <= 5
          ? "Insufficient Funds"
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
        <>
          <Button
            onClick={() => {
              if (previousBets.length > 0) {
                const previousBetCount = previousBets[previousBets.length - 1];
                setPreviousBets((prevPreviousBets) =>
                  prevPreviousBets.slice(0, -1)
                );
                setBet((prev) => ({
                  ...prev,
                  count: previousBetCount,
                }));
              }
            }}
            variant="transparency"
            fontSize="15px"
            position="absolute"
            bottom="34px"
            left="66px"
            h="fit-content"
            p="0.5rem"
          >
            Undo
          </Button>

          <Button
            as={motion.button}
            variants={fadeInVar2}
            initial="hidden"
            animate="visible"
            onClick={() => {
              props.gotPersistedData &&
                props.dispatch(props.SET_GOT_PERSISTED_DATA(false));
              props.dispatch(SET_BET(bet.count));
              props.setAnimate({ playerBet: true });
              props.setCache((prev) => ({
                ...prev,
                userProfile: {
                  ...prev.userProfile,
                  balance: prev.userProfile.balance - bet.count,
                },
              }));
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
        </>
      )}
    </ButtonGroup>
  );
};

export default BettingButtons;
