// *Design Imports*
import { Box, Image, Text, HStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const Dealer = (props) => {
  return (
    <>
      <AnimatePresence>
        {props.dealerCards.length && (
          <>
            <HStack position="relative" pointerEvents="none">
              <Box pos="relative">
                <Text variant="blackjack" fontSize="48px">
                  {props.dealerCards.length === 2 && props.dealerScore !== 21
                    ? props.dealerFaceDownScore
                    : props.dealerScore}
                </Text>
                {props.dealerScore === 21 ? (
                  <Text
                    variant="blackjack"
                    pos="absolute"
                    left="18%"
                    transform="translate(-50%, -50%)"
                    fontSize="18px"
                    textDecoration="underline"
                    textDecorationColor="g500"
                  >
                    Blackjack.
                  </Text>
                ) : props.dealerScore > 21 ? (
                  <Text
                    variant="blackjack"
                    pos="absolute"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    fontSize="18px"
                    textDecoration="underline"
                    textDecorationColor="r500"
                  >
                    Bust
                  </Text>
                ) : undefined}
              </Box>

              <Box
                as={motion.div}
                // animate={{y: ""}}
                // initial={{}}
                // exit={{}}
                ml="1rem !important"
              >
                {props.dealerCards.map((card, i) => {
                  return (
                    <Image
                      src={
                        // OR WHEN WINNER
                        props.dealerCards.length === 2 &&
                        i === 1 &&
                        props.dealerScore !== 21
                          ? props.backOfCard
                          : card.image
                      }
                      key={i}
                      display="inline-block"
                      maxW="130px"
                      h={
                        props.dealerCards.length === 2 &&
                        i === 1 &&
                        props.dealerScore !== 21
                          ? "189px"
                          : "188px"
                      }
                      ml={i > 0 && "-98px"}
                    />
                  );
                })}
              </Box>
              {props.dealerStanding && props.dealerScore < 21 && (
                <Text
                  variant="blackjack"
                  position="absolute"
                  left="50%"
                  bottom="-3.25rem"
                  transform="translate(-50%, -50%)"
                  fontSize="20px"
                  fontWeight="500"
                  bgColor="rgba(0, 0, 0, 0.25)"
                  borderWidth="1px"
                  borderBottomWidth="2px"
                  borderColor="rgba(0, 0, 0, 0.6)"
                  borderRadius="6px"
                  boxShadow="md"
                  paddingInline="1rem"
                >
                  Standing
                </Text>
              )}
            </HStack>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dealer;
