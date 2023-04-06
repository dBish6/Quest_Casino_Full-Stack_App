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
} from "@chakra-ui/react";
import tableImg from "./assets/images/Blackjack_Table_AdobeStock.jpeg";
import backOfCard from "./assets/images/back_of_card.png";

// *Custom Hooks Imports*
import useAuth from "../../../hooks/useAuth";
import useOnlyDarkMode from "../general/hooks/useOnlyDarkMode";
import useDealerTurn from "./hooks/useDealerTurn";

// *Utility Imports*
import waitForAceDecision from "./utils/waitForAceDecision";

// *Component Imports*
import MatchOrForFunModal from "../general/components/modals/MatchOrForFunModal";
import CashInModal from "../../authentication/components/modals/CashInModal";
import Header from "./components/partials/header/Header";
import Dealer from "./components/Dealer";
import Player from "./components/player/Player";
import AcePrompt from "./components/AcePrompt";
import WinnerPopup from "./components/WinnerPopup";
import RulesOverlay from "./components/RulesOverlay";
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
    rules: false,
  });
  const { colorMode } = useColorMode();
  const { currentUser, balance, setBalance } = useAuth();
  const dispatch = useDispatch();
  const gameType = useSelector(selectGameType);
  const winner = useSelector(selectWinner);

  // Dealer
  const [dealerUpdated, setDealerUpdated] = useState(null);
  const dealerTurn = useDealerTurn();
  const dealerCards = useSelector(selectDealerCards);
  const dealerFaceDownScore = useSelector(selectDealerFaceDownScore);
  const dealerScore = useSelector(selectDealerScore);
  const isDealerTurn = useSelector(selectDealerTurn);
  const dealerStanding = useSelector(selectDealerStanding);
  const dealerHasNatural = useSelector(selectDealerHasNatural);

  // Player
  const [showAcePrompt, setShowAcePrompt] = useState(false);
  const [wants11, setWants11] = useState(0);
  const playerCards = useSelector(selectPlayerCards);
  const playerBet = useSelector(selectPlayerBet);
  const playerScore = useSelector(selectPlayerScore);
  const hasPlayerHit = useSelector(selectPlayerInitialHit);
  const playerStanding = useSelector(selectPlayerStanding);
  const playerHasNatural = useSelector(selectPlayerHasNatural);

  // TODO: Make the dealer's card animation wait for the player's card animation.
  // TODO: +playerBet on win floating animation.

  useOnlyDarkMode();

  useEffect(() => {
    setShow({ ...show, gameStart: true, canCancel: false });
  }, []);

  // Updates Dealer's Score
  useEffect(() => {
    if (dealerCards.length > 1) {
      setDealerUpdated(dispatch(UPDATE_SCORE({ player: false, wants11: 11 })));
    }
  }, [dealerCards]);

  // Updates Player's Score
  useEffect(() => {
    if (playerCards.length > 1) {
      waitForAceDecision(showAcePrompt).then(() => {
        !winner && dispatch(UPDATE_SCORE({ player: true, wants11: wants11 }));

        if (wants11 > 0) setWants11(0);
      });
    } else {
      // If the player starts a new game in the middle of a game and ace prompt is showing.
      setShowAcePrompt(false);
    }
  }, [playerCards, showAcePrompt]);

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
                uid: currentUser.uid,
                // completedQuest:
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
                  uid: currentUser.uid,
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
                uid: currentUser.uid,
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
  }, [winner]);

  // Naturals Checks
  useEffect(() => {
    if (dealerHasNatural && playerHasNatural) {
      // If the dealer and the player has natural, end the game by DEALER_TURN.
      dispatch(DEALER_TURN(true));
    } else if (dealerHasNatural && hasPlayerHit) {
      // If the dealer has natural, the has one hit and could be an ace
      waitForAceDecision(showAcePrompt).then(() => {
        dispatch(DEALER_TURN(true));
      });
    } else if (playerHasNatural) {
      dispatch(DEALER_TURN(true));
      const turnDuration = setTimeout(() => {
        dealerTurn();
      }, 2500);
      return () => clearTimeout(turnDuration);
    }
  }, [dealerHasNatural, playerHasNatural, showAcePrompt, hasPlayerHit]);

  // useEffect(() => {
  //   console.log("wants11", wants11);
  //   console.log("showAcePrompt", showAcePrompt);
  //   console.log("winner", winner);
  // }, [wants11, showAcePrompt, winner]);

  // useEffect(() => {
  //   console.log("isDealerTurn", isDealerTurn);
  // }, [isDealerTurn]);

  return (
    <>
      <Box
        display="grid"
        gridTemplateRows="auto 1fr auto"
        h="100vh"
        p="2rem 5rem"
        backgroundImage={tableImg}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundAttachment="fixed"
        backgroundSize="cover"
      >
        <Header gameType={gameType} show={show} setShow={setShow} />

        {gameType && (
          <>
            {!balance ? (
              <CircularProgress
                isIndeterminate
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                // TODO: 48px for phone?
                size="68px"
                color={colorMode === "dark" ? "p300" : "r500"}
                borderColor={colorMode === "light" && "bMain"}
              />
            ) : (
              <>
                <chakra.main display="grid" gridAutoRows="auto 1fr auto">
                  <Flex
                    position="relative"
                    alignSelf="flex-start"
                    justify="center"
                    align="center"
                  >
                    <Dealer
                      dealerCards={dealerCards}
                      dealerFaceDownScore={dealerFaceDownScore}
                      dealerScore={dealerScore}
                      backOfCard={backOfCard}
                      dealerStanding={dealerStanding}
                    />
                    <Image
                      src={backOfCard}
                      position="absolute"
                      top="0"
                      right="10%"
                      maxW="130px"
                      minH="189px"
                      filter="drop-shadow(1px 0px 0px #000000) drop-shadow(0px 1px 0px #000000)"
                    />
                  </Flex>

                  <WinnerPopup winner={winner} />

                  <VStack alignSelf="flex-end" justify="center" align="center">
                    <AcePrompt
                      showAcePrompt={showAcePrompt}
                      winner={winner}
                      setShowAcePrompt={setShowAcePrompt}
                      setWants11={setWants11}
                      isDealerTurn={isDealerTurn}
                    />
                    <Player
                      playerCards={playerCards}
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
                    />
                  </VStack>
                </chakra.main>
                <Footer gameType={gameType} />
              </>
            )}
          </>
        )}
      </Box>

      <MatchOrForFunModal show={show} setShow={setShow} game={true} />
      <CashInModal show={show} setShow={setShow} game={true} />
      <RulesOverlay show={show} setShow={setShow} />
    </>
  );
};

export default BlackjackFeature;
