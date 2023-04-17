// *Design Imports*
import { Box, Heading } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeInAnimations from "../../general/utils/animations/fadeIn";

const WinnerPopup = (props) => {
  const { fadeInVar1 } = fadeInAnimations();

  return (
    <AnimatePresence>
      {props.winner !== null && (
        <Box as={motion.div} justifySelf="center" alignSelf="center">
          <Heading
            as={motion.h2}
            variants={fadeInVar1}
            initial="hidden"
            animate="visible"
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
