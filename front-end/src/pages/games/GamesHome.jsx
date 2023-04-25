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
import GameDisplay from "../../features/games/general/components/gamesDisplay";

const GamesHome = (props) => {
  const [isLargerThan675] = useMediaQuery("(min-width: 675px)");
  const { colorMode } = useColorMode();

  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      <Box mt="3rem" marginInline={isLargerThan675 && "2rem"}>
        <Heading
          fontSize={{ base: "48px", md: "56px", xl: "64px" }}
          mb="0.5rem"
          lineHeight="1.2"
          textShadow={colorMode === "light" && "1px 1px 0px #363636"}
        >
          Our Games
        </Heading>
        <Text
          fontSize={{ base: "19px", md: "21px", xl: "24px" }}
          color={colorMode === "dark" ? "wMain" : "bMain"}
          ml={{ base: "0.35rem", md: "0.35rem", xl: "0.5rem" }}
        >
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

      <GameDisplay isLargerThan675={isLargerThan675} />
    </>
  );
};

export default GamesHome;
