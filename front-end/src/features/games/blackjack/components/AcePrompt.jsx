// *Design Imports*
import { VStack, ButtonGroup, Button, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// Shows if the player get a ace!
const AcePrompt = (props) => {
  return (
    <AnimatePresence>
      {props.showAcePrompt && props.winner === null && (
        <VStack as={motion.div} mb="1.5rem">
          <Text variant="blackjack">
            Do you want to use your ace as a 11 or a 1?
          </Text>
          <ButtonGroup isDisabled={props.isDealerTurn}>
            <Button
              onClick={() => {
                props.setWants11(11);
                props.setShowAcePrompt(false);
              }}
              variant="blackjackWhite"
            >
              11
            </Button>
            <Button
              onClick={() => {
                props.setWants11(1);
                props.setShowAcePrompt(false);
              }}
              variant="blackjackWhite"
            >
              1
            </Button>
          </ButtonGroup>
        </VStack>
      )}
    </AnimatePresence>
  );
};

export default AcePrompt;
