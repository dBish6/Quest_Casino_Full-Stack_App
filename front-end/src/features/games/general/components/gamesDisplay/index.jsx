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
  Grid,
  Input,
  Link,
  IconButton,
  Tooltip,
  chakra,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { ImClubs } from "react-icons/im";
import { GiPayMoney } from "react-icons/gi";
import { MdVideogameAsset, MdOutlineLeaderboard } from "react-icons/md";

// *Custom Hooks Imports*
import useButtonFilter from "../../hooks/useButtonFilter";
import useSearchFilter from "../../hooks/useSearchFilter";

// *Utility Imports*
import content from "../../utils/gameCardContent";

// *Component Imports*
import GameCard from "./GameCard";

const GamesDisplayIndex = (props) => {
  const [gameCardContent, setGameCardContent] = useState([]);
  const [filterContent, selectedBtn] = useButtonFilter();
  const searchFilter = useSearchFilter();

  const { colorMode } = useColorMode();
  const [isSmallerThan802] = useMediaQuery("(max-width: 802px)");
  const [isLargerThan675] = useMediaQuery("(min-width: 675px)");
  const [isLargerThan615] = useMediaQuery("(min-width: 615px)");
  const [isLargerThan526] = useMediaQuery("(min-width: 526px)");
  const [isSmallerThan522] = useMediaQuery("(max-width: 522px)");
  const [isSmallerThan475] = useMediaQuery("(max-width: 475px)");

  useEffect(() => {
    setGameCardContent(content);
  }, []);

  return (
    <Box
      display="block"
      mt="3rem"
      marginInline={isLargerThan675 && "2rem"}
      // p={{
      //   base: "1.5rem 1rem 3rem 1rem",
      //   md: "1.5rem 1rem 3rem 1rem",
      //   xl: "1.5rem 2rem 3rem 2rem",
      // }}
      // p={
      //   props.isBiggerThan600
      //     ? "1.5rem 2rem 3rem 2rem"
      //     : "1.5rem 1rem 3rem 1rem"
      // }
      p={{
        base: "1.5rem 1rem 3rem 1rem",
        md: "1.5rem 2rem 3rem 2rem",
        xl: "1.5rem 2rem 3rem 2rem",
      }}
      bg={colorMode === "dark" ? "fadeD" : "fadeL"}
      borderTopLeftRadius="1rem"
      borderTopRightRadius="1rem"
    >
      <HStack
        mb="2rem"
        ml={{
          base: "0",
          md: "0",
          xl: "1rem",
        }}
        // justify={!isSmallerThan475 && "space-between"}
        justify="space-between"
        align={isLargerThan615 ? "center" : "flex-start"}
      >
        <ButtonGroup
          display="grid"
          gridTemplateColumns={
            isLargerThan615 ? "repeat(3, auto)" : "repeat(2, auto)"
          }
          placeItems="center"
          gap={{
            base: "0.5rem",
            md: "12px",
            xl: "12px",
          }}
          flexWrap="wrap"
        >
          <Button
            variant="chipRed"
            leftIcon={isLargerThan526 && <ImClubs />}
            onClick={() => setGameCardContent(filterContent("cards", content))}
            w="max-content"
          >
            {selectedBtn.type === "cards" ? selectedBtn.text : "Cards"}
          </Button>
          <Button
            variant="chipGreen"
            leftIcon={isLargerThan526 && <GiPayMoney />}
            onClick={() => setGameCardContent(filterContent("slots", content))}
            m="0 !important"
            w="max-content"
          >
            {selectedBtn.type === "slots" ? selectedBtn.text : "Slots"}
          </Button>
          <Button
            variant="chipYellow"
            leftIcon={isLargerThan526 && <MdVideogameAsset />}
            onClick={() => setGameCardContent(filterContent("other", content))}
            m="0 !important"
            w="max-content"
          >
            {selectedBtn.type === "other" ? selectedBtn.text : "Other"}
          </Button>
        </ButtonGroup>

        <Flex
          position="relative"
          gap={{
            base: "1rem",
            md: "1.5rem",
            xl: "2rem",
          }}
          ml="1rem !important"
          align="center"
        >
          <Input
            variant="primary"
            placeholder="Search"
            _focus={{
              _placeholder: { opacity: 0.9 },
              borderColor: colorMode === "dark" ? "p500" : "bMain",
              boxShadow: "lg",
            }}
            _placeholder={{
              opacity: 0.75,
              color: colorMode === "dark" ? "dwordMain" : "bMain",
            }}
            onChange={(e) => setGameCardContent(searchFilter(e, content))}
          />
          {isSmallerThan802 ? (
            <Tooltip hasArrow label="Leaderboard">
              <IconButton
                icon={<MdOutlineLeaderboard size="28px" />}
                aria-label="leaderboard"
                variant="transparency"
                position={isSmallerThan475 && "absolute"}
                top={isSmallerThan475 && "-4rem"}
                right={isSmallerThan475 && "0"}
              />
            </Tooltip>
          ) : (
            <Link variant="simple">Leaderboard</Link>
          )}
        </Flex>
      </HStack>

      <HStack
        flexWrap="wrap"
        gap="1.5rem 2.625rem"
        justify={isSmallerThan522 && "center"}
        marginInline={{
          base: "1rem 0",
          md: "1rem 0",
          xl: "2rem",
        }}
      >
        <GameCard content={gameCardContent} />
      </HStack>
    </Box>
  );
};

export default GamesDisplayIndex;
