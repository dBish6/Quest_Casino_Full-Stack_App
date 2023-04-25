/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

// *Design Imports*
import {
  Box,
  chakra,
  Flex,
  Image,
  VStack,
  CircularProgress,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import tableImg from "./assets/images/Blackjack_Table_AdobeStock.jpeg";
import backOfCard from "./assets/images/back_of_card.png";
import { motion } from "framer-motion";
import fadeInAnimations from "../general/utils/animations/fadeIn";

// *Custom Hooks Imports*
import useAuth from "../../../hooks/useAuth";
import useOnlyDarkMode from "../general/hooks/useOnlyDarkMode";
import useCardSoundEffect from "./hooks/useCardSoundEffect";
import useDealerTurn from "./hooks/useDealerTurn";

// *Utility Import*
import waitForAceDecision from "./utils/waitForAceDecision";

// *Component Imports*
import MatchOrForFunModal from "../general/components/modals/MatchOrForFunModal";
import CashInModal from "../../authentication/components/modals/CashInModal";
import Header from "./components/partials/header/Header";
import Dealer from "./components/Dealer";
import Player from "./components/player/Player";
import AcePrompt from "./components/AcePrompt";
import WinnerPopup from "./components/WinnerPopup";
import RulesOverlay from "./components/rulesOverlay/RulesOverlay";
import Footer from "./components/partials/Footer";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_SCORE,
  DETERMINE_WINNER,
  DEALER_TURN,
} from "./redux/blackjackSlice";
import {
  selectGameType,
  selectDealerCards,
  selectDealerFaceDownScore,
  selectDealerScore,
  selectDealerTurn,
  selectDealerStanding,
  selectDealerHasNatural,
  selectPlayerCards,
  selectPlayerBet,
  selectPlayerScore,
  selectPlayerInitialHit,
  selectPlayerStanding,
  selectPlayerHasNatural,
  selectWinner,
} from "./redux/blackjackSelectors";
import { updateWinsBalanceThunk } from "./redux/blackjackSlice";

const BlackjackFeature = () => {
  // Other
  const [show, setShow] = useState({
    gameStart: false,
    canCancel: false,
    cashIn: false,
    options: false,
    rules: false,
  });
  const { fadeInVar2 } = fadeInAnimations(0.8);
  const { colorMode } = useColorMode();
  const [isWidthSmallerThan1429] = useMediaQuery("(max-width: 1429px)");
  const [isHeightSmallerThan844] = useMediaQuery("(max-height: 844px)");
  const { currentUser, balance, setBalance } = useAuth();
  const dispatch = useDispatch();
  const gameType = useSelector(selectGameType);
  const winner = useSelector(selectWinner);

  // Dealer
  const [dealerViewWidthOnMoreCards, setDealerViewWidthOnMoreCards] =
    useState("30.6vw");
  const [dealerUpdated, setDealerUpdated] = useState(null);
  const dealerTurn = useDealerTurn();
  const dealerCards = useSelector(selectDealerCards);
  const dealerFaceDownScore = useSelector(selectDealerFaceDownScore);
  const dealerScore = useSelector(selectDealerScore);
  const isDealerTurn = useSelector(selectDealerTurn);
  const dealerStanding = useSelector(selectDealerStanding);
  const dealerHasNatural = useSelector(selectDealerHasNatural);

  // Player
  const [playerViewWidthOnMoreCards, setPlayerViewWidthOnMoreCards] =
    useState("30.6vw");
  const [showAcePrompt, setShowAcePrompt] = useState(false);
  const [madeAceDecision, setMadeAceDecision] = useState(false);
  const [secureAceOnNatural, setSecureAceOnNatural] = useState(false);
  const [wants11, setWants11] = useState(0);
  const playerCards = useSelector(selectPlayerCards);
  const playerBet = useSelector(selectPlayerBet);
  const playerScore = useSelector(selectPlayerScore);
  const hasPlayerHit = useSelector(selectPlayerInitialHit);
  const playerStanding = useSelector(selectPlayerStanding);
  const playerHasNatural = useSelector(selectPlayerHasNatural);

  // TODO: +playerBet on win floating animation.

  useOnlyDarkMode();

  const toggleMute = useCardSoundEffect(playerCards, dealerCards);

  useEffect(() => {
    setShow({ ...show, gameStart: true, canCancel: false });
  }, []);

  // Updates Dealer's Score
  useEffect(() => {
    if (dealerCards.length > 0) {
      // For slideCard variant animation.
      setDealerViewWidthOnMoreCards(
        parseFloat(dealerViewWidthOnMoreCards.slice(0, 4)) - 0.85 + "vw"
      );

      setDealerUpdated(dispatch(UPDATE_SCORE({ player: false, wants11: 11 })));
    }
  }, [dealerCards]);

  // Updates Player's Score
  useEffect(() => {
    if (playerCards.length > 0) {
      if (
        playerCards[0].face === "A" &&
        !playerHasNatural &&
        !madeAceDecision
      ) {
        // To not update the score for the ace, but update for the second card.
        dispatch(UPDATE_SCORE({ player: true, wants11: 0 }));
      } else {
        waitForAceDecision(showAcePrompt).then(() => {
          !winner && dispatch(UPDATE_SCORE({ player: true, wants11: wants11 }));

          if (wants11 > 0) setWants11(0);
        });
      }
    } else {
      // If the player starts a new game in the middle of a game and ace prompt is showing.
      setShowAcePrompt(false);
    }
  }, [playerCards, showAcePrompt]);

  useEffect(() => {
    if (playerCards.length > 0) {
      // For slideCard variant animation.
      setPlayerViewWidthOnMoreCards(
        parseFloat(playerViewWidthOnMoreCards.slice(0, 4)) - 0.85 + "vw"
      );

      // For slideCardResponsive variant animation.
      if (isWidthSmallerThan1429 || isHeightSmallerThan844) {
        document.body.style.overflow = "hidden";
        const animationDuration = setTimeout(() => {
          document.body.style.overflow = "unset";
        }, 1300);
        return () => clearTimeout(animationDuration);
      }
    }
  }, [playerCards]);

  // When the player is standing.
  useEffect(() => {
    if (playerStanding && !dealerStanding && !winner) {
      const turnDuration = setTimeout(() => {
        setDealerUpdated(dealerTurn());
      }, 2500);
      return () => clearTimeout(turnDuration);
    }
  }, [playerStanding, dealerStanding, dealerScore]);

  // Determines the winner when it is dealers turn and when there is a update to his score.
  useEffect(() => {
    if (dealerCards.length > 1 && isDealerTurn) {
      Promise.all([dealerUpdated || dealerStanding]).then(() => {
        if (playerScore === 21 && !playerHasNatural && !dealerHasNatural) {
          // If the player has 21 and no one has naturals, wait until the dealer is done hitting
          // until a bust or a blackjack before determining the winner.
          !winner &&
            dealerScore >= 21 &&
            dispatch(
              DETERMINE_WINNER({
                displayName: currentUser.displayName,
              })
            );
        } else if (playerScore === 21 && !dealerHasNatural) {
          // If the player has 21 and the player does have a natural, wait for the dealers turn (2500ms) to be over then
          // DETERMINE_WINNER because Davy Blackjack is a little bit different; the one who doesn't have a natural has one chance.
          const waitForTurn = setTimeout(() => {
            !winner &&
              dispatch(
                DETERMINE_WINNER({
                  displayName: currentUser.displayName,
                })
              );
          }, 2600);
          return () => {
            setDealerUpdated(null);
            clearTimeout(waitForTurn);
          };
        } else {
          !winner &&
            dispatch(
              DETERMINE_WINNER({
                displayName: currentUser.displayName,
              })
            );
        }
      });

      return () => setDealerUpdated(null);
    }
  }, [dealerScore, isDealerTurn, dealerStanding]);

  // Then when there is winner, update the player's wins and balance.
  useEffect(() => {
    if (winner && gameType === "Match") {
      const newBalance =
        winner === currentUser.displayName
          ? balance + playerBet * 2
          : winner === "push"
          ? balance + playerBet
          : balance;

      new Promise((resolve) => {
        setBalance(newBalance);
        resolve();
      }).then(() => {
        if (winner !== "push")
          dispatch(
            updateWinsBalanceThunk({
              uid: currentUser.uid,
              winner: winner,
              game: "blackjack",
              balance: newBalance,
            })
          );
      });
    }
    if (winner !== null) {
      setDealerViewWidthOnMoreCards("30.6vw");
      setPlayerViewWidthOnMoreCards("30.6vw");
      setMadeAceDecision(false);
    }
  }, [winner]);

  // Naturals Checks
  useEffect(() => {
    if (dealerHasNatural && playerHasNatural) {
      // If the dealer and the player has natural, end the game by DEALER_TURN.
      dispatch(DEALER_TURN(true));
    } else if (dealerHasNatural && hasPlayerHit) {
      // I had to put this here below because when the dealer has a natural, it just a sudden didn't work right for me.
      // So, if the player gets a ace on their only hit, the showAcePrompt would be false on the first render; the showAcePrompt useEffect
      // ran at the same time, which caused the waitForAceDecision() to resolve when it wasn't supposed to.
      if (
        playerCards[2].image.includes("ace") &&
        !showAcePrompt &&
        !secureAceOnNatural
      ) {
        setSecureAceOnNatural(true);
        return;
      }
      // If the dealer has natural, player has one hit and could be an ace.
      waitForAceDecision(showAcePrompt).then(() => {
        dispatch(DEALER_TURN(true));
        setSecureAceOnNatural(false);
      });
    } else if (playerHasNatural) {
      dispatch(DEALER_TURN(true));
      const turnDuration = setTimeout(() => {
        dealerTurn();
      }, 2500);
      return () => clearTimeout(turnDuration);
    }
  }, [dealerHasNatural, playerHasNatural, showAcePrompt, hasPlayerHit]);

  return (
    <>
      <Box
        aria-label="Structure"
        display="grid"
        gridTemplateRows="auto 1fr auto"
        h="100vh"
        p={{
          base: "1.75rem 1.5rem 1rem 1.5rem",
          md: "1.75rem 3rem 1rem 3rem",
          xl: "1.75rem 5rem 1rem 5rem",
        }}
        backgroundImage={tableImg}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundAttachment="fixed"
        backgroundSize="cover"
      >
        <Header
          gameType={gameType}
          show={show}
          setShow={setShow}
          toggleMute={toggleMute}
        />

        {gameType && (
          <>
            {balance === null ? (
              <CircularProgress
                isIndeterminate
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                size="68px"
                color={colorMode === "dark" ? "p300" : "r500"}
                borderColor={colorMode === "light" && "bMain"}
              />
            ) : (
              <>
                <chakra.main
                  aria-label="Playing Area"
                  display="grid"
                  gridAutoRows="auto 1fr auto"
                >
                  <Flex
                    position="relative"
                    alignSelf="flex-start"
                    justify="center"
                    align="center"
                  >
                    <Dealer
                      dealerCards={dealerCards}
                      dealerViewWidthOnMoreCards={dealerViewWidthOnMoreCards}
                      dealerFaceDownScore={dealerFaceDownScore}
                      dealerScore={dealerScore}
                      backOfCard={backOfCard}
                      dealerStanding={dealerStanding}
                      isWidthSmallerThan1429={isWidthSmallerThan1429}
                      isHeightSmallerThan844={isHeightSmallerThan844}
                    />
                    <Image
                      src={backOfCard}
                      alt="Card Deck"
                      as={motion.img}
                      variants={fadeInVar2}
                      initial={["hidden", { x: "31.55vw" }]}
                      animate={["visible", { x: "31.55vw" }]}
                      display={
                        isWidthSmallerThan1429 || isHeightSmallerThan844
                          ? "none"
                          : "initial"
                      }
                      position="absolute"
                      top="0"
                      maxW="130px"
                      minH="189px"
                      filter="drop-shadow(1px 0px 0px #000000) drop-shadow(0px 1px 0px #000000)"
                    />
                  </Flex>

                  <WinnerPopup winner={winner} />

                  <VStack alignSelf="flex-end" justify="center" align="center">
                    <AcePrompt
                      showAcePrompt={showAcePrompt}
                      setMadeAceDecision={setMadeAceDecision}
                      winner={winner}
                      setShowAcePrompt={setShowAcePrompt}
                      setWants11={setWants11}
                      isDealerTurn={isDealerTurn}
                    />
                    <Player
                      playerCards={playerCards}
                      playerViewWidthOnMoreCards={playerViewWidthOnMoreCards}
                      playerBet={playerBet}
                      playerScore={playerScore}
                      hasPlayerHit={hasPlayerHit}
                      currentUser={currentUser}
                      balance={balance}
                      setBalance={setBalance}
                      showAcePrompt={showAcePrompt}
                      setShowAcePrompt={setShowAcePrompt}
                      winner={winner}
                      gameType={gameType}
                      dealerHasNatural={dealerHasNatural}
                      playerHasNatural={playerHasNatural}
                      isWidthSmallerThan1429={isWidthSmallerThan1429}
                      isHeightSmallerThan844={isHeightSmallerThan844}
                    />
                  </VStack>

                  <RulesOverlay show={show} setShow={setShow} />
                </chakra.main>
                <Footer gameType={gameType} />
              </>
            )}
          </>
        )}
      </Box>

      <MatchOrForFunModal
        show={show}
        setShow={setShow}
        gameType={gameType}
        winner={winner}
        playerCards={playerCards}
      />
      <CashInModal show={show} setShow={setShow} />
    </>
  );
};

export default BlackjackFeature;
