// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Design Imports*
import {
  Box,
  VStack,
  Heading,
  Text,
  chakra,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";

// *Component Imports*
import Header from "../../components/Header";
import GameDisplay from "../../features/games/home/components/gamesDisplay";

const GamesHome = (props) => {
  const [isBiggerThan600] = useMediaQuery("(min-width: 600px)");
  const { colorMode } = useColorMode();

  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      <Box mt="3rem" marginInline={isBiggerThan600 && "2rem"}>
        <Heading
          fontSize="64px"
          mb="1rem"
          // textShadow={
          //   colorMode === "dark" ? "1px 1px 0px #E0E2EA" : "1px 1px 0px #363636"
          // }
          textShadow={colorMode === "light" && "1px 1px 0px #363636"}
        >
          Our Games
        </Heading>
        <Text fontSize="24px">
          Play for fun in our{" "}
          <chakra.span
            fontFamily="roboto"
            fontWeight="700"
            fontStyle="italic"
            color={colorMode === "light" ? "g500" : "r500"}
            textShadow={colorMode === "light" && "1px 1px 0px #363636"}
          >
            “for fun”
          </chakra.span>{" "}
          mode or cash in and test your luck in{" "}
          <chakra.span
            fontFamily="roboto"
            fontWeight="700"
            fontStyle="italic"
            color={colorMode === "light" ? "r500" : "g500"}
            textShadow={colorMode === "light" && "1px 1px 0px #363636"}
          >
            “matches”
          </chakra.span>
          . Join us now and discover the{" "}
          <chakra.span
            fontFamily="roboto"
            fontWeight="700"
            fontStyle="italic"
            color="p500"
            textShadow={colorMode === "light" && "1px 1px 0px #363636"}
          >
            excitement!
          </chakra.span>
        </Text>
      </Box>

      <GameDisplay isBiggerThan600={isBiggerThan600} />
    </>
  );
};

export default GamesHome;
