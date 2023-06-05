// *Design Imports*
import { Box, Heading } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeInAnimations from "../../../general/utils/animations/fadeIn";

const WinnerPopup = ({ winner }) => {
  const { fadeInVar1 } = fadeInAnimations();

  return (
    <AnimatePresence>
      {winner !== null && (
        <Box as={motion.div} justifySelf="center" alignSelf="center">
          <Heading
            as={motion.h2}
            variants={fadeInVar1}
            initial="hidden"
            animate="visible"
            variant="blackjack"
            fontFamily="fugaz"
            fontSize="60px"
            textAlign="center"
            lineHeight="1.2"
          >
            {winner === "dealer"
              ? `Dealer Wins`
              : winner === "push"
              ? "Push!"
              : `${winner} Wins!`}
          </Heading>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default WinnerPopup;
