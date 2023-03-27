import { useState, useEffect } from "react";

// *Design Imports*
import {
  Box,
  HStack,
  Flex,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  Text,
  Input,
  Link,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { ImClubs } from "react-icons/im";
import { GiPayMoney } from "react-icons/gi";
import { MdOutlineVideogameAsset } from "react-icons/md";

// *Custom Hooks Imports*
import useButtonFilter from "../../hooks/useButtonFilter";
import useSearchFilter from "../../hooks/useSearchFilter";

// *Utility Imports*
import content from "../../utils/gameCardContent";

// *Component Imports*
import GameCard from "./GameCard";

const GamesDisplayIndex = (props) => {
  const { colorMode } = useColorMode();
  const [gameCardContent, setGameCardContent] = useState([]);

  const [filterContent, selectedBtn] = useButtonFilter();
  const searchFilter = useSearchFilter();

  useEffect(() => {
    setGameCardContent(content);
  }, []);

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
      <HStack mb="2rem" ml="1rem" justify="space-between">
        <ButtonGroup display="flex" alignItems="center" gap="4px">
          <Button
            variant="chipRed"
            leftIcon={<ImClubs />}
            onClick={() => setGameCardContent(filterContent("cards", content))}
          >
            {selectedBtn.type === "cards" ? selectedBtn.text : "Cards"}
          </Button>
          <Button
            variant="chipGreen"
            leftIcon={<GiPayMoney />}
            onClick={() => setGameCardContent(filterContent("slots", content))}
          >
            {selectedBtn.type === "slots" ? selectedBtn.text : "Slots"}
          </Button>
          <Button
            variant="chipYellow"
            leftIcon={<MdOutlineVideogameAsset />}
            onClick={() => setGameCardContent(filterContent("other", content))}
          >
            {selectedBtn.type === "other" ? selectedBtn.text : "Other"}
          </Button>
        </ButtonGroup>

        <Flex gap="2rem" align="center">
          <Input
            variant="primary"
            placeholder="Search"
            _focus={{
              _placeholder: { opacity: 0.9 },
              borderColor: colorMode === "dark" ? "p500" : "bMain",
              boxShadow: "lg",
            }}
            _placeholder={{ opacity: 0.75, color: "dwordMain" }}
            onChange={(e) => setGameCardContent(searchFilter(e, content))}
          />
          <Link variant="simple">Leaderboard</Link>
        </Flex>
      </HStack>

      <HStack flexWrap="wrap" gap="1.5rem 2.625rem" marginInline="2rem">
        <GameCard content={gameCardContent} />
      </HStack>
    </Box>
  );
};

export default GamesDisplayIndex;
