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
import useDealerTurn from "./hooks/useDealerTurn";

// *Utility Import*
import waitForAceDecision from "./utils/waitForAceDecision";

// *API Services Import*
import GetUserBalance from "../../authentication/api_services/GetUserBalance";

// *Component Imports*
import MatchOrForFunModal from "../general/components/modals/MatchOrForFunModal";
import CashInModal from "../../authentication/components/modals/CashInModal";
import Header from "./components/partials/header/Header";
import Dealer from "./components/Dealer";
import Player from "./components/player/Player";
import AcePrompt from "./components/AcePrompt";
import WinnerPopup from "./components/WinnerPopup";
import Footer from "./components/partials/Footer";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_SCORE,
  DETERMINE_WINNER,
  SET_WALLET,
} from "./redux/blackjackSlice";
import {
  selectGameType,
  selectDealerCards,
  selectDealerFaceDownScore,
  selectDealerScore,
  selectDealerTurn,
  selectDealerStanding,
  selectPlayerCards,
  selectPlayerScore,
  selectPlayerStanding,
  selectWinner,
  selectWallet,
} from "./redux/blackjackSelectors";

const BlackjackFeature = () => {
  // Other
  const [show, setShow] = useState({
    gameStart: false,
    canCancel: false,
    cashIn: false,
  });
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();
  const { fetchBalance, fsUserBalance, loading, abortController } =
    GetUserBalance(currentUser.uid, true);

  // Dealer
  const [dealerUpdated, setDealerUpdated] = useState(null);
  const dealerTurn = useDealerTurn();

  // Player
  const [playerUpdated, setPlayerUpdated] = useState(null);
  const [showAcePrompt, setShowAcePrompt] = useState(false);
  const [wants11, setWants11] = useState(0);

  // Redux
  const gameType = useSelector(selectGameType);
  const dealerCards = useSelector(selectDealerCards);
  const dealerFaceDownScore = useSelector(selectDealerFaceDownScore);
  const dealerScore = useSelector(selectDealerScore);
  const isDealerTurn = useSelector(selectDealerTurn);
  const dealerStanding = useSelector(selectDealerStanding);
  const playerCards = useSelector(selectPlayerCards);
  const playerScore = useSelector(selectPlayerScore);
  const playerStanding = useSelector(selectPlayerStanding);
  const winner = useSelector(selectWinner);
  const wallet = useSelector(selectWallet);
  const dispatch = useDispatch();

  // TODO: Make the dealer's card animation wait for the player's card animation.
  // TODO: +playerBet on win floating animation.

  useEffect(() => {
    setShow({ gameStart: true, canCancel: false });
  }, []);

  // Sets the wallet as the user's balance initially.
  useEffect(() => {
    if (gameType === "Match" && wallet === null) {
      fetchBalance(dispatch, SET_WALLET);
      return () => abortController.abort();
    }
  }, [gameType]);

  // Update Scores UseEffect
  useEffect(() => {
    if (dealerCards.length > 1 && playerCards.length > 1) {
      Promise.all([
        dealerUpdated || dealerStanding === true,
        playerUpdated || dealerStanding === true,
      ]).then(() => {
        // If 21, wait for the dealers turn (2500ms) to be over then DETERMINE_WINNER because the dealer can push.
        if (playerScore === 21) {
          setTimeout(() => {
            !winner &&
              dispatch(
                DETERMINE_WINNER({
                  displayName: currentUser.displayName,
                  uid: currentUser.uid,
                })
              );
          }, 2600);
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
    }
  }, [dealerUpdated, playerUpdated, dealerStanding, playerStanding]);

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
        !winner &&
          setPlayerUpdated(
            dispatch(UPDATE_SCORE({ player: true, wants11: wants11 }))
          );
        if (wants11 > 0) setWants11(0);
      });
    } else {
      // If the player starts a new game in the middle of a game and ace prompt is showing.
      setShowAcePrompt(false);
    }
  }, [playerCards, showAcePrompt]);

  // When the player is standing.
  useEffect(() => {
    if (playerStanding && !dealerStanding && winner === null) {
      // This waitForAceDecision() is here because the player stands when they double down and could get an ace.
      waitForAceDecision(showAcePrompt).then(() => {
        setTimeout(() => {
          setDealerUpdated(dealerTurn());
        }, 2500);
      });
    }
  }, [playerStanding, dealerStanding, dealerScore, showAcePrompt]);

  // useEffect(() => {
  //   console.log("wants11", wants11);
  //   console.log("showAcePrompt", showAcePrompt);
  //   console.log("winner", winner);
  // }, [wants11, showAcePrompt, winner]);

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
        <Header gameType={gameType} setShow={setShow} wallet={wallet} />

        {gameType && (
          <>
            {/* Loading for getting the balance. */}
            {loading ? (
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
                      playerScore={playerScore}
                      playerStanding={playerStanding}
                      wallet={wallet}
                      showAcePrompt={showAcePrompt}
                      setShowAcePrompt={setShowAcePrompt}
                      winner={winner}
                      gameType={gameType}
                    />
                  </VStack>
                </chakra.main>
                <Footer gameType={gameType} />
              </>
            )}
          </>
        )}
      </Box>

      <MatchOrForFunModal show={show} setShow={setShow} />
      <CashInModal show={show.cashIn} setShow={setShow} />
    </>
  );
};

export default BlackjackFeature;
