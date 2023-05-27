// *Design Imports*
import { Box, Image, Text, HStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeInAnimations from "../../general/utils/animations/fadeIn";
import cardAnimation from "../../general/utils/animations/blackjack/cardAnimation";

const Dealer = (props) => {
  const { fadeInVar2 } = fadeInAnimations(0.8);
  const { slideCard, slideCardResponsive } = cardAnimation(
    false,
    props.dealerViewWidthOnMoreCards
  );

  return (
    <>
      <AnimatePresence>
        {props.dealerCards.length && (
          <>
            <HStack position="relative" pointerEvents="none">
              <Box pos="relative">
                <Text
                  aria-label="Dealer Score"
                  as={motion.p}
                  variants={fadeInVar2}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  key="dealerScore"
                  variant="blackjack"
                  fontSize="48px"
                >
                  {props.dealerCards.length === 2 && props.dealerScore !== 21
                    ? props.dealerFaceDownScore
                    : props.dealerScore}
                </Text>
                {props.dealerScore === 21 ? (
                  <Text
                    aria-label="Has Blackjack"
                    as={motion.p}
                    initial={["hidden", { x: "-50%", y: "-50%", left: "18%" }]}
                    animate={["visible", { x: "-50%", y: "-50%", left: "18%" }]}
                    exit={["hidden", { x: "-50%", y: "-50%", left: "18%" }]}
                    key="dealerBlackjack"
                    variant="blackjack"
                    pos="absolute"
                    fontSize="18px"
                    textDecoration="underline"
                    textDecorationColor="g500"
                  >
                    Blackjack.
                  </Text>
                ) : props.dealerScore > 21 ? (
                  <Text
                    aria-label="Has Bust"
                    as={motion.p}
                    initial={["hidden", { x: "-50%", y: "-50%", left: "50%" }]}
                    animate={["visible", { x: "-50%", y: "-50%", left: "50%" }]}
                    exit={["hidden", { x: "-50%", y: "-50%", left: "50%" }]}
                    key="dealerBust"
                    variant="blackjack"
                    pos="absolute"
                    fontSize="18px"
                    textDecoration="underline"
                    textDecorationColor="r500"
                  >
                    Bust
                  </Text>
                ) : undefined}
              </Box>

              <Box role="group" aria-label="Dealer Cards" ml="1rem !important">
                {props.dealerCards.map((card, i) => (
                  <Box
                    key={i}
                    aria-label={`Dealer Card ${i} Container`}
                    display="inline-block"
                  >
                    <Image
                      src={
                        props.dealerCards.length === 2 &&
                        i === 1 &&
                        props.dealerScore !== 21
                          ? props.backOfCard
                          : card.image
                      }
                      alt={`Dealer Card ${i}`}
                      as={motion.img}
                      variants={
                        props.isWidthSmallerThan1429 ||
                        props.isHeightSmallerThan844
                          ? slideCardResponsive
                          : slideCard
                      }
                      initial="fromDeck"
                      animate="toHand"
                      exit="giveBack"
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
                  </Box>
                ))}
              </Box>

              {props.dealerStanding && props.dealerScore < 21 && (
                <Text
                  as={motion.p}
                  variants={fadeInVar2}
                  initial={["hidden", { x: "-50%", y: "-50%" }]}
                  animate={["visible", { x: "-50%", y: "-50%" }]}
                  exit={["hidden", { x: "-50%", y: "-50%" }]}
                  key="dealerStanding"
                  variant="blackjack"
                  position="absolute"
                  left="50%"
                  bottom="-3.5rem"
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
