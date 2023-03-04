// *Design Imports*
import {
  Container,
  Box,
  HStack,
  Heading,
  ButtonGroup,
  Button,
  Text,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { ImClubs } from "react-icons/im";
import { GiPayMoney } from "react-icons/gi";
import { MdOutlineVideogameAsset } from "react-icons/md";

// *API Services Import*

// *Component Imports*
import GameCard from "./GameCard";
import Leaderboard from "./Leaderboard";

const GamesDisplayIndex = (props) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      display="block"
      mt="3rem"
      marginInline={props.isBiggerThan600 && "2rem"}
      p="1.5rem 2rem 3rem 2rem"
      bg={colorMode === "dark" ? "fadeD" : "fadeL"}
      borderTopLeftRadius="1rem"
      borderTopRightRadius="1rem"
    >
      <HStack mb="2rem">
        <Heading>All Games</Heading>
        <ButtonGroup>
          <Button leftIcon={<ImClubs />}>Cards</Button>
          <Button leftIcon={<GiPayMoney />}>Slots</Button>
          <Button leftIcon={<MdOutlineVideogameAsset />}>Other</Button>
        </ButtonGroup>
      </HStack>

      <GameCard />
    </Box>
  );
};

export default GamesDisplayIndex;
