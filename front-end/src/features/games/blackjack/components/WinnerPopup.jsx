// *Design Imports*
import { Box, Heading } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const WinnerPopup = (props) => {
  return (
    <AnimatePresence>
      {props.winner !== null && (
        <Box as={motion.div} justifySelf="center" alignSelf="center">
          <Heading
            variant="blackjack"
            fontFamily="fugaz"
            fontSize="60px"
            lineHeight="1.2"
          >
            {props.winner === "dealer"
              ? `Dealer Wins`
              : props.winner === "push"
              ? "Push!"
              : `${props.winner} Wins!`}
          </Heading>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default WinnerPopup;
