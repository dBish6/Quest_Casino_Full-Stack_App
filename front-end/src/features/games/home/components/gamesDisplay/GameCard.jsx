import { useState } from "react";
import { useNavigate } from "react-router-dom";

// *Design Imports*
import {
  Box,
  VStack,
  Text,
  Badge,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const content = [
  {
    title: "Davy Blackjack",
    description:
      "Classic blackjack! You'll be playing against the dealer, whoever has the highest total number without exceeding 21 wins. It's a game of skill and techniques, so bring your best strategy.",
    url: "/games/blackjack",
  },
];

const GameCard = () => {
  const [show, setShow] = useState(false);

  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <>
      {content.map((detail, i) => {
        return (
          <VStack
            key={i}
            position="relative"
            maxW="200px"
            minH="200px"
            p="0.5rem"
            bgColor={colorMode === "dark" ? "bd600" : "bl200"}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onClick={() => navigate(detail.url)}
          >
            {/* <chakra.video src=""></chakra.video> */}
            {detail.description.includes("blackjack!") && (
              <Badge variant="subtle" colorScheme="green" position="absolute">
                New!
              </Badge>
            )}

            <Text position="relative" bottom="0">
              {detail.title}
            </Text>
            <AnimatePresence>
              {show && (
                <Box
                  as={motion.div}
                  position="absolute"
                  //   maxW="184px"
                  left="50%"
                  top="50%"
                  transform="translate(-50%, -50%)"
                >
                  <Text fontSize="14px">{detail.description}</Text>
                </Box>
              )}
            </AnimatePresence>
          </VStack>
        );
      })}
    </>
  );
};

export default GameCard;
