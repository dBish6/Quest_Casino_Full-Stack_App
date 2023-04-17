import { Link as ReactLink } from "react-router-dom";

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
  UnorderedList,
  ListItem,
  chakra,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Divider,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import DiceLogo from "../../../../assets/Dice.png";
import { motion, AnimatePresence } from "framer-motion";

// *Component Import*
import MyHeading from "../../../../components/MyHeading";

const RulesOverlay = (props) => {
  return (
    <>
      <AnimatePresence>
        {props.show.rules && (
          <Container
            as={motion.div}
            position="absolute"
            top="0"
            left="0"
            minW="100vw"
            minH="100vh"
            p="1rem"
            bgColor="rgba(66, 75, 94, 0.85)"
            zIndex="overlay"
          >
            <chakra.header
              display="grid"
              gridTemplateColumns={{
                base: "1fr 1fr",
                md: "1fr auto 1fr",
                xl: "1fr auto 1fr",
              }}
              mb="4rem"
            >
              <Link
                as={ReactLink}
                to="/home"
                display={{
                  base: "none",
                  md: "initial",
                  xl: "initial",
                }}
                ml="4rem"
              >
                <Image src={DiceLogo} />
              </Link>
              <Heading
                variant="blackjack"
                fontSize="48px"
                lineHeight="1.2"
                color="p400"
              >
                Rules
              </Heading>
              <Box justifySelf="flex-end" mr="1rem">
                <IconButton
                  icon={<MdClose fontSize="24px" />}
                  onClick={() => props.setShow({ ...props.show, rules: false })}
                  variant="exit"
                  borderRadius="50%"
                />
              </Box>
            </chakra.header>

            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr" }}
              templateRows={{
                base: "",
                md: "max-content 1fr max-content",
                xl: "max-content 1fr max-content",
              }}
              placeItems="center"
              gap="1.5rem 2.5rem"
              // minH="100vh"
            >
              <Flex
                as="section"
                gridColumn={{ base: "", md: "span 2", xl: "span 2" }}
                justify="center"
                w={{ base: "100%", md: "90%", xl: "90%" }}
                pb="1.5rem"
                maxW="1215px"
                borderBottomWidth="1px"
              >
                <Box>
                  <MyHeading
                    variant="blackjack"
                    text="General"
                    lineHeight="32px"
                    fontFamily="body"
                    fontSize="32px"
                    fontWeight="600"
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
                      <chakra.span fontWeight="700">"Push"</chakra.span> and the
                      player's bet is returned.
                    </ListItem>
                    <ListItem>
                      If either the player's or the dealer's hand{" "}
                      <chakra.span fontWeight="700">exceeds 21</chakra.span>, it
                      results in a{" "}
                      <chakra.span fontWeight="700">"Bust"</chakra.span> and the
                      respective party loses the game.
                    </ListItem>
                    <ListItem>
                      In Davy Blackjack if the Player gets a{" "}
                      <chakra.span fontWeight="700">"Natural"</chakra.span>{" "}
                      (gets a blackjack on the initial deal), then the dealer
                      has{" "}
                      <chakra.span fontWeight="700">
                        one hit for a chance of getting blackjack
                      </chakra.span>
                      . If the dealer gets blackjack on that one hit, it will
                      result in a push.{" "}
                      <chakra.span fontWeight="700">
                        Same rules goes for the player
                      </chakra.span>{" "}
                      if the dealer gets a "Natural".
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Flex>

              <Box
                as="section"
                justifySelf="center"
                alignSelf="flex-start"
                maxW="680px"
                pb={{ base: "1.5rem", md: 0, xl: 0 }}
                borderBottomWidth={{ base: "1px", md: 0, xl: 0 }}
              >
                <MyHeading
                  variant="blackjack"
                  text="Player"
                  lineHeight="32px"
                  fontFamily="body"
                  fontSize="32px"
                  fontWeight="600"
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
                <MyHeading
                  variant="blackjack"
                  text="Dealer"
                  lineHeight="32px"
                  fontFamily="body"
                  fontSize="32px"
                  fontWeight="600"
                  mb="0.5rem"
                />
                <UnorderedList>
                  <ListItem>
                    When the dealer deals, one card is given to the player
                    before dealing one to himself. Then, they deal another card
                    to the player, so the player has two up cards and then to
                    himself again. Once the dealer has two cards, one is face
                    up, and the other is{" "}
                    <chakra.span fontWeight="700">face down</chakra.span> (the
                    "hole" card).
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
                    <chakra.span fontWeight="700">
                      17 or more, unless the player has blackjack.
                    </chakra.span>
                    .
                  </ListItem>
                  <ListItem>
                    <chakra.span fontWeight="700">Aces</chakra.span> is always
                    counted as 11 for the dealer.
                  </ListItem>
                </UnorderedList>
              </Box>

              <Popover>
                <PopoverTrigger>
                  <Link
                    variant="simple"
                    gridColumn={{ base: "", md: "span 2", xl: "span 2" }}
                    justifySelf="flex-end"
                  >
                    Davy Blackjack v1.1.5-alpha
                  </Link>
                </PopoverTrigger>
                <PopoverContent bgColor="bd700" maxH="500px" overflowY="scroll">
                  <PopoverCloseButton color="dwordMain" />
                  <PopoverHeader
                    textDecoration="underline"
                    borderColor="borderD"
                  >
                    Change Log
                  </PopoverHeader>
                  <PopoverBody>
                    <Heading
                      textAlign="center"
                      fontSize="24px"
                      lineHeight="1.2"
                      mb="4px"
                    >
                      v1.0.0
                    </Heading>
                    <UnorderedList fontSize="14px">
                      <ListItem>Adds animations.</ListItem>
                      <ListItem>
                        When the dealer deals, the cards are displayed in the
                        order they are dealt.
                      </ListItem>
                      <ListItem>
                        Adds 3 sound variations when given cards for the player
                        and the dealer.
                      </ListItem>
                      <ListItem>
                        More responsive, so mobile devices can play.
                      </ListItem>
                      <ListItem>
                        More options for the dropdown and has been refactored.
                      </ListItem>
                      <ListItem>
                        Had to fix when the dealer gets a natural regarding how
                        the showAcePrompt useEffect ran at the same time as the
                        naturals useEffect.
                      </ListItem>
                      <ListItem>
                        Fixes when the player bets and has a balance of 0 after
                        the bet; couldn't play because the buttons gets disabled
                        if the balance is falsy, now everything checks if the
                        balance is null.
                      </ListItem>
                    </UnorderedList>
                    <Divider m="0.5rem 0" />
                    <Heading
                      textAlign="center"
                      fontSize="24px"
                      lineHeight="1.2"
                      mb="4px"
                    >
                      v1.1.5-alpha
                    </Heading>
                    <UnorderedList fontSize="14px">
                      <ListItem>
                        Fixed missing dependency in determine winner useEffect
                        and added clean-up functions; The game now determines
                        the winner when both are standing.
                      </ListItem>
                      <ListItem>
                        Implements new redux state, streak, to keep track of the
                        player's wins in a row for "On a Role" quest and adds
                        "Beginner's Luck" quest.
                      </ListItem>
                      <ListItem>
                        Changes regarding how the completedQuests state and
                        wallet state is handled is not in redux anymore and used
                        in the authContext now, so changes was made how the
                        balance is handled.
                      </ListItem>
                      <ListItem>Fixed hamburger menu animation.</ListItem>
                    </UnorderedList>
                    <Divider m="0.5rem 0" />
                    <Heading
                      textAlign="center"
                      fontSize="24px"
                      lineHeight="1.2"
                      mb="4px"
                    >
                      v1.0.2-alpha
                    </Heading>
                    <UnorderedList fontSize="14px">
                      <ListItem>
                        Fixes how blackjack was played entirely. Was a stupid
                        mistake, in blackjack the dealer waits for the player to
                        finish (if the player gets blackjack, stands or bust).
                        The way I had it, the dealers turn ran when the player
                        makes their first decision (if the player hit or stand).
                        But now Davy Blackjack works like blackjack should.
                      </ListItem>
                      <ListItem>
                        When the player gets a blackjack, the dealer now keeps
                        doing their turn until a blackjack or a bust before
                        determining the winner.
                      </ListItem>
                    </UnorderedList>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Grid>
          </Container>
        )}
      </AnimatePresence>
    </>
  );
};

export default RulesOverlay;
