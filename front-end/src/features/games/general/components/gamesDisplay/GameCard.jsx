import { useState } from "react";
import { useNavigate } from "react-router-dom";

// *Design Imports*
import {
  Container,
  Box,
  VStack,
  Text,
  Badge,
  chakra,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const GameCard = (props) => {
  const [show, setShow] = useState(-1);

  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <>
      {props.content.map((detail, i) => {
        return (
          <Container
            key={i}
            position="relative"
            maxW="200px"
            minH="200px"
            m="0 !important"
            bgColor={colorMode === "dark" ? "bd600" : "bl200"}
            borderRadius="6px"
            cursor="pointer"
            onMouseEnter={() => setShow(i)}
            onMouseLeave={() => setShow(-1)}
            onClick={() => navigate(detail.url)}
          >
            {detail.description.includes("blackjack!") && (
              <Badge
                variant="solid"
                colorScheme="green"
                position="absolute"
                left="8px"
                top="-10px"
              >
                New!
              </Badge>
            )}
            <VStack
              position="relative"
              minH="200px"
              p="0.5rem"
              overflow="hidden"
            >
              {/* <chakra.video src=""></chakra.video> */}

              <Text mt="0 !important">{detail.title}</Text>
              <AnimatePresence>
                {show === i && (
                  <Box
                    as={motion.div}
                    animate={{
                      // FIXME:
                      opacity: 0.7,
                      // y: 0,
                      maxHeight: "163px",
                      transition: { duration: 0.5, type: "tween" },
                    }}
                    initial={{
                      opacity: 0,
                      // y: "200px",
                      // maxHeight: "0",
                    }}
                    exit={{
                      opacity: 0,
                      // y: "200px",
                      // maxHeight: "0",
                      transition: { duration: 0.5, type: "tween" },
                    }}
                    position="absolute"
                    bottom="0"
                    w="100%"
                    // maxH="163px"
                    // maxH="100%"
                    padding="0.5rem 1rem"
                    bgColor={colorMode === "dark" ? "bd300" : "bl400"}
                    borderBottomRadius="6px"
                    pointerEvents="none"
                  >
                    <Text fontSize="14px">{detail.description}</Text>
                  </Box>
                )}
              </AnimatePresence>
            </VStack>
          </Container>
        );
      })}
    </>
  );
};

export default GameCard;
