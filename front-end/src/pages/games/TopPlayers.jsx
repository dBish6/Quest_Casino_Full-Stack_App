// *Design Imports*
import {
  Box,
  Heading,
  Text,
  chakra,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";

// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Component Imports*
import Leaderboard from "../../features/games/general/components/Leaderboard";

const TopPlayers = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);
  const [isLargerThan675] = useMediaQuery("(min-width: 675px)");
  const { colorMode } = useColorMode();

  return (
    <Box mt="3rem" marginInline={isLargerThan675 && "2rem"}>
      <Heading
        fontSize={{ base: "48px", md: "56px", xl: "64px" }}
        mb="0.5rem"
        lineHeight="1.2"
        textShadow={colorMode === "light" && "1px 1px 0px #363636"}
        textAlign="center"
      >
        Leaderboard
      </Heading>
      <Text
        fontSize={{ base: "19px", md: "21px", xl: "24px" }}
        color={colorMode === "dark" ? "wMain" : "bMain"}
        textAlign="center"
        ml={{ base: "0.35rem", md: "0.35rem", xl: "0.5rem" }}
      >
        These are the{" "}
        <chakra.span
          fontFamily="roboto"
          fontWeight="700"
          fontStyle="italic"
          color="p500"
          textShadow={colorMode === "light" && "1px 1px 0px #363636"}
        >
          top 10
        </chakra.span>
        {"  "}players ranked by their total number of{"  "}
        <chakra.span
          fontFamily="roboto"
          fontWeight="700"
          fontStyle="italic"
          color="g500"
          textShadow={colorMode === "light" && "1px 1px 0px #363636"}
        >
          wins
        </chakra.span>
        .
      </Text>
      <Leaderboard />
    </Box>
  );
};

export default TopPlayers;
