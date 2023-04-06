// *Design Imports*
import { VStack, Button, ButtonGroup, Text, chakra } from "@chakra-ui/react";

// *Custom Hooks Imports*
import useDisableScroll from "../../../../../hooks/useDisableScroll";
import useStartGame from "../../../blackjack/hooks/useStartGame";

// *Component Imports*
import ModalTemplate from "../../../../../components/modals/ModalTemplate";
import Header from "../../../../../components/Header";

// *Redux Imports*
import { useDispatch } from "react-redux";
import { GAME_TYPE, START_GAME } from "../../../blackjack/redux/blackjackSlice";

const MatchOrForFunModal = (props) => {
  const dispatch = useDispatch();
  const startGame = useStartGame();
  useDisableScroll(props.show.gameStart, 510);

  return (
    <ModalTemplate
      show={props.show.gameStart}
      setShow={props.setShow}
      objName="gameStart"
      game="blackjack"
      animation={{ type: "up", y: "200%" }}
      p="1.5rem 2rem"
      maxW="fit-content"
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
      <Header fontSize="32px" mb="1.5rem" text="Select Game Type" />

      <VStack>
        <ButtonGroup>
          <Button
            onClick={() => {
              dispatch(GAME_TYPE("match"));
              props.show.canCancel && dispatch(START_GAME());
              props.setShow({ ...props.show, gameStart: false });
            }}
            variant="primary"
          >
            Matches
          </Button>
          <Button
            onClick={() => {
              dispatch(GAME_TYPE("fun"));
              startGame();
              props.setShow({ ...props.show, gameStart: false });
            }}
            variant="secondary"
            ml="1rem !important"
          >
            For Fun
          </Button>
        </ButtonGroup>

        <Text as="small">
          Play <chakra.span fontWeight="600">"for real"</chakra.span> or play{" "}
          <chakra.span fontWeight="600">"for fun"</chakra.span>.
        </Text>
      </VStack>
    </ModalTemplate>
  );
};

export default MatchOrForFunModal;
