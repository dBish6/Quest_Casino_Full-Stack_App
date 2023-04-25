/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

// *Design Imports*
import {
  Box,
  ButtonGroup,
  Button,
  Image,
  Text,
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeInAnimations from "../../../general/utils/animations/fadeIn";
import cardAnimation from "../../../general/utils/animations/blackjack/cardAnimation";

// *Custom Hooks Imports*
import useDealerTurn from "../../hooks/useDealerTurn";
import useBlackjackQuestsCompletion from "../../../../quests/hooks/useBlackjackQuestsCompletion";

// *Utility Import*
import waitForAceDecision from "../../utils/waitForAceDecision";

// *Component Imports*
import DealButton from "./DealButton";
import BettingButtons from "./BettingButtons";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import {
  PLAYER_HIT,
  SET_PLAYER_STANDING,
  DOUBLE_DOWN,
  DEALER_TURN,
} from "../../redux/blackjackSlice";
import {
  selectDealerTurn,
  selectBalanceLoading,
} from "../../redux/blackjackSelectors";

const Player = (props) => {
  const isDealerTurn = useSelector(selectDealerTurn);
  const dispatch = useDispatch();
  const dealerTurn = useDealerTurn();
  const [isHeightSmallerThan910] = useMediaQuery("(max-height: 910px)");
  const { fadeInVar2 } = fadeInAnimations(0.8);
  const { slideCard, slideCardResponsive } = cardAnimation(
    true,
    props.playerViewWidthOnMoreCards,
    isHeightSmallerThan910
  );
  const [showcaseRunning, toggleShowcaseRunning] = useState(false);

  const [prevAcesInHandLength, setPrevAcesInHandLength] = useState(-1);
  const [acesInCurrentHand, setAcesInCurrentHand] = useState([]);

  const balanceLoading = useSelector(selectBalanceLoading);
  const completedQuestLoading = useBlackjackQuestsCompletion(props.currentUser);

  useEffect(() => {
    props.winner
      ? setPrevAcesInHandLength(-1)
      : setPrevAcesInHandLength(acesInCurrentHand.length);
  }, [acesInCurrentHand, props.winner]);

  useEffect(() => {
    if (props.winner) setAcesInCurrentHand([]);
  }, [props.winner]);

  // Checks if any aces are in the players hand.
  useEffect(() => {
    if (props.playerCards.length && prevAcesInHandLength !== -1) {
      const currentAces = props.playerCards.filter((card) => card.face === "A");
      if (
        // So Ace Prompt doesn't show when the player has blackjack on first turn.
        (props.playerCards.length === 2 &&
          ["J", "Q", "K"].includes(props.playerCards[0].face) &&
          props.playerCards[1].face === "A") ||
        (props.playerCards.length === 2 &&
          props.playerCards[0].face === "A" &&
          ["J", "Q", "K"].includes(props.playerCards[1].face))
      ) {
        return;
      } else if (
        props.playerCards.length === 2 &&
        props.playerCards[0].face === "A" &&
        props.playerCards[1].face === "A"
      ) {
        // If the player gets a double ace on the first turn.
        props.setShowAcePrompt(true);
        if (props.playerScore >= 1) {
          waitForAceDecision(props.showAcePrompt).then(() => {
            props.setShowAcePrompt(false);
          });
        }
        setAcesInCurrentHand(currentAces);
      } else if (
        // If a new ace is found, show the ace prompt.
        currentAces.length > prevAcesInHandLength &&
        currentAces.length > 0 &&
        props.playerCards.length >= 2
      ) {
        props.setShowAcePrompt(true);
        setAcesInCurrentHand(currentAces);
      }
    }
  }, [props.playerCards, prevAcesInHandLength, props.showAcePrompt]);

  // Makes the dealer showcase their turn when the game is over; player busts or has blackjack.
  useEffect(() => {
    if (props.playerScore >= 21 && !props.playerHasNatural) {
      dispatch(DEALER_TURN(true));
      if (props.playerScore !== 21) {
        toggleShowcaseRunning(true);
        const turnDuration = setTimeout(() => {
          dealerTurn();
          toggleShowcaseRunning(false);
        }, 2500);
        return () => clearTimeout(turnDuration);
      } else if (props.playerScore === 21) {
        dispatch(SET_PLAYER_STANDING(true));
      }
    }
  }, [props.playerScore]);

  return (
    <>
      <AnimatePresence>
        {props.playerCards.length && (
          <>
            <HStack
              m="0 !important"
              mb={props.winner !== null && "0.75rem !important"}
              pointerEvents="none"
            >
              <Box pos="relative">
                <Text
                  as={motion.p}
                  variants={fadeInVar2}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  key="playerScore"
                  variant="blackjack"
                  fontSize="48px"
                >
                  {props.playerScore}
                </Text>
                {props.playerScore === 21 ? (
                  <Text
                    as={motion.p}
                    variants={fadeInVar2}
                    initial={["hidden", { x: "-50%", y: "-50%", left: "18%" }]}
                    animate={["visible", { x: "-50%", y: "-50%", left: "18%" }]}
                    exit={["hidden", { x: "-50%", y: "-50%", left: "18%" }]}
                    key="playerBlackjack"
                    variant="blackjack"
                    pos="absolute"
                    fontSize="18px"
                    textDecoration="underline"
                    textDecorationColor="g500"
                  >
                    Blackjack!
                  </Text>
                ) : props.playerScore > 21 ? (
                  <Text
                    as={motion.p}
                    variants={fadeInVar2}
                    initial={["hidden", { x: "-50%", y: "-50%", left: "50%" }]}
                    animate={["visible", { x: "-50%", y: "-50%", left: "50%" }]}
                    exit={["hidden", { x: "-50%", y: "-50%", left: "50%" }]}
                    key="playerBust"
                    variant="blackjack"
                    pos="absolute"
                    fontSize="18px"
                    textDecoration="underline"
                    textDecorationColor="r500"
                  >
                    Bust
                  </Text>
                ) : undefined}
              </Box>

              <Box aria-label="Player Cards" ml="1rem !important">
                {props.playerCards.map((card, i) => {
                  return (
                    <Image
                      src={card.image}
                      alt={`Player Card ${i}`}
                      as={motion.img}
                      variants={
                        props.isWidthSmallerThan1429 ||
                        props.isHeightSmallerThan844
                          ? slideCardResponsive
                          : slideCard
                      }
                      initial="fromDeck"
                      animate="toHand"
                      exit="giveBack"
                      display="inline-block"
                      key={i}
                      maxW="130px"
                      h="188px"
                      ml={i > 0 && "-98px"}
                    />
                  );
                })}
              </Box>
            </HStack>
          </>
        )}
      </AnimatePresence>

      {props.playerCards.length && props.winner === null ? (
        <>
          <ButtonGroup minW="255px">
            <Button
              onClick={() => {
                dispatch(SET_PLAYER_STANDING(true));
                dispatch(DEALER_TURN(true));
              }}
              isDisabled={
                props.playerCards.length === 1 ||
                isDealerTurn ||
                props.showAcePrompt ||
                props.dealerHasNatural
              }
              variant="blackjackRed"
              w="100%"
            >
              Stand
            </Button>
            <Button
              onClick={() => {
                dispatch(PLAYER_HIT());
              }}
              isDisabled={
                props.playerCards.length === 1 ||
                isDealerTurn ||
                props.showAcePrompt
              }
              variant="blackjackGreen"
              w="100%"
            >
              Hit
            </Button>
            {!props.hasPlayerHit && props.gameType === "Match" && (
              <Button
                onClick={() => {
                  props.gameType === "Match" &&
                    props.setBalance(props.balance - props.playerBet);
                  dispatch(DOUBLE_DOWN());
                  dispatch(PLAYER_HIT());
                }}
                isDisabled={
                  props.playerCards.length === 1 ||
                  props.balance < props.playerBet ||
                  isDealerTurn ||
                  props.showAcePrompt
                }
                variant="blackjackBlue"
                w="100%"
              >
                Double
              </Button>
            )}
          </ButtonGroup>
          {props.gameType === "Match" && (
            <Text
              variant="blackjack"
              fontSize="20px"
              fontWeight="500"
              color="g500"
              bgColor="rgba(0, 0, 0, 0.25)"
              borderWidth="1px"
              borderBottomWidth="2px"
              borderColor="rgba(0, 0, 0, 0.6)"
              borderRadius="6px"
              boxShadow="md"
              paddingInline="1rem"
            >
              ${props.playerBet}
            </Text>
          )}
        </>
      ) : (
        <>
          {props.gameType === "Fun" ? (
            <DealButton
              isDealerTurn={isDealerTurn}
              showcaseRunning={showcaseRunning}
              playerCards={props.playerCards}
            />
          ) : (
            <BettingButtons
              isDealerTurn={isDealerTurn}
              showcaseRunning={showcaseRunning}
              balance={props.balance}
              setBalance={props.setBalance}
              gameType={props.gameType}
              balanceLoading={balanceLoading}
              completedQuestLoading={completedQuestLoading}
              playerCards={props.playerCards}
            />
          )}
        </>
      )}
    </>
  );
};

export default Player;
