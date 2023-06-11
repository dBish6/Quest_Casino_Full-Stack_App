// *Design Imports*
import { chakra, Flex, Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import fadeInAnimations from "../../../general/utils/animations/fadeIn";

// *Component Import*
import Streak from "../player/Streak";

const Footer = (props) => {
  const { fadeInVar1 } = fadeInAnimations();

  return (
    <chakra.footer
      role="none"
      display="flex"
      alignItems="center"
      gap="0.5rem"
      mt="1.5rem"
    >
      <Flex
        role="group"
        as={motion.div}
        variants={fadeInVar1}
        initial="hidden"
        animate="visible"
        align="center"
        gap="0.5rem"
      >
        <Box
          aria-label="Playing"
          borderRadius="50%"
          w="1rem"
          h="1rem"
          bgColor="#FF2D2D"
        />
        <Text aria-label="Game Mode" variant="blackjack">
          {props.gameType === "Fun"
            ? "For " + props.gameType + " Mode"
            : props.gameType + " Mode"}
        </Text>
      </Flex>

      {props.gameType === "Match" && (
        <Streak
          gameType={props.gameType}
          winStreak={props.winStreak}
          animate={props.animate}
          setAnimate={props.setAnimate}
        />
      )}
    </chakra.footer>
  );
};

export default Footer;
