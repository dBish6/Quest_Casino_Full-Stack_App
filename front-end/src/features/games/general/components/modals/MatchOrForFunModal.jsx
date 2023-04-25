import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// *Design Imports*
import {
  VStack,
  Button,
  ButtonGroup,
  Text,
  Link,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

// *Custom Hooks Import*
import useDisableScroll from "../../../../../hooks/useDisableScroll";

// *Component Imports*
import ModalTemplate from "../../../../../components/modals/ModalTemplate";
import MyHeading from "../../../../../components/MyHeading";

// *Redux Imports*
import { useDispatch } from "react-redux";
import { GAME_TYPE, START_GAME } from "../../../blackjack/redux/blackjackSlice";

const MatchOrForFunModal = (props) => {
  const [needToFinish, setNeedToFinish] = useState({
    state: false,
    clicked: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  useDisableScroll(props.show.gameStart, 510);

  useEffect(() => {
    console.log("needToFinish", needToFinish);
  }, [needToFinish]);

  return (
    <ModalTemplate
      show={props.show.gameStart}
      setShow={props.setShow}
      objName="gameStart"
      game="blackjack"
      animation={{ type: "up", y: "200%" }}
      p="1.5rem 2rem 1rem 2rem"
      maxW="max-content"
    >
      {props.show.canCancel && (
        <Button
          onClick={() => {
            props.setShow({ ...props.show, gameStart: false });
          }}
          variant="exit"
          position="absolute"
          top="-10px"
          right="-10px"
        >
          &#10005;
        </Button>
      )}
      <MyHeading fontSize="32px" mb="1.5rem" text="Select Game Type" />

      <VStack>
        <ButtonGroup>
          <Button
            onClick={() => {
              props.gameType === "Fun" &&
                props.playerCards.length > 0 &&
                dispatch(START_GAME());

              props.gameType !== "Match" && dispatch(GAME_TYPE("match"));
              props.setShow({ ...props.show, gameStart: false });
            }}
            variant="primary"
          >
            Matches
          </Button>
          <Button
            as={motion.button}
            onClick={() => {
              if (
                props.gameType === "Match" &&
                props.winner === null &&
                props.playerCards.length > 0
              ) {
                setNeedToFinish({ state: true, clicked: true });
                toast({
                  description:
                    "Please complete your game before changing the mode.",
                  status: "error",
                  duration: 6000,
                  isClosable: true,
                  position: "top",
                  variant: "solid",
                });
                setTimeout(() => {
                  setNeedToFinish((prev) => ({ ...prev, clicked: false }));
                }, 601);
              } else {
                if (needToFinish.state || needToFinish.clicked)
                  setNeedToFinish({ state: false, clicked: false });
                if (props.gameType !== "Fun") {
                  dispatch(GAME_TYPE("fun"));
                  props.playerCards.length > 0 && dispatch(START_GAME());
                }
                props.setShow({ ...props.show, gameStart: false });
              }
            }}
            animate={{
              x: needToFinish.clicked ? [0, -18, 18, -18, 18, -18, 18, 0] : 0,
              transition: {
                type: "spring",
                damping: 6,
                stiffness: 50,
                duration: 0.6,
              },
            }}
            variant="secondary"
            bgColor={
              needToFinish.state && props.winner === null
                ? "r500"
                : "transparent"
            }
            _active={{
              bgColor:
                needToFinish.state && props.winner === null ? "r500" : "g500",
            }}
            ml="1rem !important"
          >
            For Fun
          </Button>
        </ButtonGroup>

        <Text as="small">
          Play <chakra.span fontWeight="600">for real</chakra.span> or play{" "}
          <chakra.span fontWeight="600">for fun</chakra.span>.
        </Text>

        {!props.show.canCancel && (
          <Link onClick={() => navigate("/games")} variant="simple">
            Go Back
          </Link>
        )}
      </VStack>
    </ModalTemplate>
  );
};

export default MatchOrForFunModal;
