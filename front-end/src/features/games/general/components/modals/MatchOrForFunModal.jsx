import { useEffect } from "react";

// *Design Imports*
import {
  Container,
  VStack,
  Button,
  ButtonGroup,
  Text,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Custom Hooks Imports*
import useStartGame from "../../../blackjack/hooks/useStartGame";

// *Component Imports*
import ModalBackdrop from "../../../../../components/modals/ModalBackdrop";
import Header from "../../../../../components/Header";

// *Redux Imports*
import { useDispatch } from "react-redux";
import { GAME_TYPE, START_GAME } from "../../../blackjack/redux/blackjackSlice";

// *Animations*
const model = {
  visible: {
    scale: 1.0,
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 70 },
    },
  },
  hidden: {
    scale: 1.0,
    y: "150%",
    x: "-50%",
    opacity: 0,
  },
  exit: {
    scale: 0.8,
    x: "-50%",
    opacity: 0,
    transition: {
      duration: 0.5,
      type: "tween",
    },
  },
};

const MatchOrForFunModal = (props) => {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const startGame = useStartGame();

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 510);
    }
  }, [props.show]);

  return (
    <AnimatePresence>
      {props.show.gameStart && (
        <>
          <ModalBackdrop
            show={props.show}
            setShow={props.setShow}
            type="gameStart"
          />
          <Container
            as={motion.div}
            variants={model}
            animate="visible"
            initial="hidden"
            exit="exit"
            zIndex="modal"
            position="fixed"
            top="50%"
            left="50%"
            p="1.5rem 2rem"
            maxW="fit-content"
            backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
          >
            {props.show.canCancel && (
              <Button
                onClick={() => props.setShow({ gameStart: false })}
                variant="exit"
                position="absolute"
                top="-8px"
                right="-8px"
              >
                &#10005;
              </Button>
            )}
            <Header fontSize="32px" mb="1.5rem" text="Select Game Type" />

            <VStack>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    dispatch(GAME_TYPE("match"));
                    props.show.canCancel && dispatch(START_GAME());
                    props.setShow({ gameStart: false });
                  }}
                  variant="primary"
                >
                  Match
                </Button>
                <Button
                  onClick={() => {
                    dispatch(GAME_TYPE("fun"));
                    startGame();
                    props.setShow({ gameStart: false });
                  }}
                  variant="secondary"
                  ml="1rem !important"
                >
                  For Fun
                </Button>
              </ButtonGroup>

              <Text as="small">
                Play <chakra.span fontWeight="600">"for real"</chakra.span> or
                play <chakra.span fontWeight="600">"for fun"</chakra.span>.
              </Text>
            </VStack>
          </Container>
        </>
      )}
    </AnimatePresence>
  );
};

export default MatchOrForFunModal;
