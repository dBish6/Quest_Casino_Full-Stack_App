// *Design Imports*
import {
  Container,
  Heading,
  Link,
  Image,
  IconButton,
  Flex,
  Grid,
  Box,
  Text,
  UnorderedList,
  ListItem,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { MdClose } from "react-icons/md";
import DiceLogo from "../../../../assets/Dice.png";
import { motion, AnimatePresence } from "framer-motion";

// *Component Import*
import Header from "../../../../components/Header";

const RulesOverlay = (props) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <AnimatePresence>
        {props.showRules && (
          <Container
            as={motion.div}
            position="fixed"
            top="0"
            left="0"
            minW="100vw"
            minH="100vh"
            p="1rem"
            bgColor={
              colorMode === "dark"
                ? "rgba(66, 75, 94, 0.85)"
                : "rgba(204, 209, 218, 0.85)"
            }
            zIndex="overlay"
          >
            <chakra.header
              display="grid"
              gridTemplateColumns="1fr auto 1fr"
              // marginInline="4rem 1rem"
              mb="4rem"
            >
              <Link as={ReactLink} to="/home" ml="4rem">
                <Image src={DiceLogo} />
              </Link>
              <Heading variant="blackjack" fontSize="48px" color="p400">
                Rules
              </Heading>
              <Box justifySelf="flex-end" mr="1rem">
                <IconButton
                  icon={<MdClose fontSize="24px" />}
                  onClick={() => props.setShowRules(false)}
                  variant="exit"
                  borderRadius="50%"
                />
              </Box>
            </chakra.header>

            <Grid
              templateColumns="1fr 1fr"
              templateRows="max-content 1fr max-content"
              placeItems="center"
              gap="1.5rem"
              // minH="100vh"
            >
              <Flex
                as="section"
                gridColumn="span 2"
                justify="center"
                w="90%"
                pb="1.5rem"
                borderBottomWidth="1px"
                borderColor={colorMode === "dark" ? "borderD" : "borderL"}
              >
                <Box>
                  <Header
                    variant="blackjack"
                    text="General"
                    lineHeight="32px"
                    fontFamily="body"
                    fontSize="32px"
                    fontWeight="600"
                    // color="p400"
                    mb="0.5rem"
                  />
                  <UnorderedList>
                    <ListItem>
                      The <chakra.span fontWeight="700">objective</chakra.span>{" "}
                      of blackjack is to have a hand that is worth more than the
                      dealer's hand, but without going over 21.
                    </ListItem>
                    <ListItem>
                      Cards 2 through 10 are worth their face value.
                    </ListItem>
                    <ListItem>
                      Face cards (Jack, Queen, King) are worth 10.
                    </ListItem>
                    <ListItem>
                      <chakra.span fontWeight="700">Aces</chakra.span> can be
                      worth 1 or 11, whichever is more favorable for the player.
                    </ListItem>
                    <ListItem>
                      A <chakra.span fontWeight="700">"blackjack"</chakra.span>{" "}
                      is a hand that includes an Ace and a ten-point card (10,
                      J, Q, K). It is an automatic win for the player, unless
                      the dealer also has a blackjack, in which case it is a
                      push.
                    </ListItem>
                    <ListItem>
                      If the player and dealer have the{" "}
                      <chakra.span fontWeight="700">same hand</chakra.span> in
                      total, it will result in a{" "}
                      <chakra.span fontWeight="700">"push"</chakra.span> and the
                      player's bet is returned.
                    </ListItem>
                    <ListItem>
                      If either the player's or the dealer's hand{" "}
                      <chakra.span fontWeight="700">exceeds 21</chakra.span>, it
                      results in a{" "}
                      <chakra.span fontWeight="700">"bust"</chakra.span> and the
                      respective party loses the game.
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Flex>

              <Box
                as="section"
                justifySelf="center"
                alignSelf="flex-start"
                maxW="680px"
              >
                <Header
                  variant="blackjack"
                  text="Player"
                  lineHeight="32px"
                  fontFamily="body"
                  fontSize="32px"
                  fontWeight="600"
                  // color="p400"
                  mb="0.5rem"
                />
                <UnorderedList>
                  <ListItem>The player has to place a bet.</ListItem>
                  <ListItem>
                    The player must decide whether to{" "}
                    <chakra.span fontWeight="700">"hit"</chakra.span> (ask for
                    another card) or{" "}
                    <chakra.span fontWeight="700">"stand"</chakra.span> (keep
                    the current hand).
                  </ListItem>
                  <ListItem>
                    The player can also{" "}
                    <chakra.span fontWeight="700">double down</chakra.span> by
                    doubling their current bet, but only if the player{" "}
                    <chakra.span fontWeight="700">haven't hit yet</chakra.span>{" "}
                    and when doubling they will receive a card and{" "}
                    <chakra.span fontWeight="700">
                      will not be able to hit again.
                    </chakra.span>
                  </ListItem>
                  <ListItem>
                    If the player's hand is{" "}
                    <chakra.span fontWeight="700">higher</chakra.span> than the
                    dealer's hand, the player wins.
                  </ListItem>
                </UnorderedList>
              </Box>

              <Box
                as="section"
                justifySelf="center"
                alignSelf="flex-start"
                maxW="680px"
              >
                <Header
                  variant="blackjack"
                  text="Dealer"
                  lineHeight="32px"
                  fontFamily="body"
                  fontSize="32px"
                  fontWeight="600"
                  // color="p400"
                  mb="0.5rem"
                />
                <UnorderedList>
                  <ListItem>
                    The dealer deals two cards to the player and two cards to
                    himself. One of the dealer's cards is face up, and the other
                    is <chakra.span fontWeight="700">face down</chakra.span>{" "}
                    (the "hole" card).
                  </ListItem>
                  <ListItem>
                    If the dealer's hand is{" "}
                    <chakra.span fontWeight="700">higher</chakra.span> than the
                    player's hand and does not bust, the player loses.
                  </ListItem>
                  <ListItem>
                    The dealer must hit on a hand total of{" "}
                    <chakra.span fontWeight="700">16 or less</chakra.span>.
                  </ListItem>
                  <ListItem>
                    The dealer must stand on a hand total of{" "}
                    <chakra.span fontWeight="700">17 or more</chakra.span>.
                  </ListItem>
                  <ListItem>
                    <chakra.span fontWeight="700">Aces</chakra.span> is always
                    counted as 11 for the dealer.
                  </ListItem>
                </UnorderedList>
              </Box>

              <Text gridColumn="span 2" justifySelf="flex-end">
                Davy Blackjack v1.0.0-alpha
              </Text>
            </Grid>
          </Container>
        )}
      </AnimatePresence>
    </>
  );
};

export default RulesOverlay;
