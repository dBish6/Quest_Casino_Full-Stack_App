import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LazyLoad from "react-lazy-load";

// *Design Imports*
import {
  Container,
  Box,
  VStack,
  Text,
  Badge,
  Divider,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import davyBlackjackPreview from "../../assets/Davy-Blackjack-Screenshot.png";

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
            <VStack position="relative" minH="235px" overflow="hidden">
              <Text
                as="h4"
                mt="0.5rem !important"
                fontSize="18px"
                fontWeight="500"
                fontStyle="italic"
                zIndex="1"
              >
                {detail.title}
              </Text>
              <Divider />
              {i === 0 && (
                <LazyLoad>
                  <Box w="198px" h="190px" m="0 !important">
                    <Image
                      src={davyBlackjackPreview}
                      objectFit="cover"
                      h="100%"
                      borderBottomRadius="6px"
                    />
                  </Box>
                </LazyLoad>
              )}

              <AnimatePresence>
                {show === i && (
                  <Box
                    as={motion.div}
                    initial={{
                      opacity: 0,
                      backgroundColor: colorMode === "dark" ? "bd300" : "bl400",
                      maxHeight: 0,
                    }}
                    animate={{
                      opacity: 1,
                      backgroundColor:
                        colorMode === "dark"
                          ? "rgb(138, 147, 167, 0.7)"
                          : "rgb(204, 209, 218, 0.7)",
                      maxHeight: "163px",
                      transition: {
                        duration: 0.5,
                        type: "tween",
                        ease: "easeOut",
                      },
                    }}
                    exit={{
                      opacity: 0,

                      maxHeight: 0,
                      transition: {
                        duration: 0.5,
                        type: "tween",
                        ease: "easeIn",
                      },
                    }}
                    key="description"
                    position="absolute"
                    bottom="0"
                    w="100%"
                    padding="0.5rem 1rem"
                    borderBottomRadius="6px"
                    pointerEvents="none"
                    zIndex="1"
                  >
                    <Text
                      fontSize="14px"
                      color={colorMode === "dark" ? "wMain" : "bMain"}
                      opacity="0.9"
                    >
                      {detail.description}
                    </Text>
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
