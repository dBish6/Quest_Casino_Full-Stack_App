// *Design Imports*
import { chakra, Box, Text } from "@chakra-ui/react";

const Footer = (props) => {
  return (
    <chakra.footer display="flex" alignItems="center" gap="0.5rem">
      <Box borderRadius="50%" w="1rem" h="1rem" bgColor="#FF2D2D" />
      <Text variant="blackjack">
        {props.gameType === "Fun"
          ? "For " + props.gameType + " Mode"
          : props.gameType + " Mode"}
      </Text>
    </chakra.footer>
  );
};

export default Footer;
