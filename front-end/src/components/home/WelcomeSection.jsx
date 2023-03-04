import { useState, useRef } from "react";

// *Design Imports*
import {
  Image,
  Container,
  HStack,
  Box,
  Heading,
  chakra,
  Divider,
  Flex,
  Text,
  VStack,
  Icon,
  useColorMode,
  Grid,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion, useScroll } from "framer-motion";
import cardsImg from "../../assets/cards-pngwing.com.png";
import { CgCardSpades } from "react-icons/cg";
import { AiOutlineTrophy, AiOutlineSafety } from "react-icons/ai";

const WelcomeSection = () => {
  const { colorMode } = useColorMode();
  const { scrollYProgress } = useScroll();
  const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");
  const [isSmallerThan378] = useMediaQuery("(max-width: 378px)");

  return (
    <>
      <Image
        src={cardsImg}
        as={motion.img}
        initial={{ scale: 0.8, rotate: "10.58deg", opacity: 0 }}
        whileInView={{
          scale: 1,
          rotate: "18.58deg",
          opacity: 1,
          transition: {
            //  duration: 0.28,
            delay: 0.95,
            opacity: { duration: 0.2 },
          },
        }}
        viewport={{ width: window.innerWidth, height: window.innerHeight }}
        progress={scrollYProgress}
        position="absolute"
        left="72.5%"
        top="9.5%"
        maxW="297px"
        minH="306px"
        zIndex="-1"
      />
      <Container
        as={motion.div}
        initial={{ height: 0, opacity: 0, y: "50%" }}
        whileInView={{
          minHeight: "543px",
          opacity: 1,
          y: "0",
          transition: { duration: 1 },
        }}
        viewport={{ width: window.innerWidth, height: window.innerHeight }}
        progress={scrollYProgress}
        maxW="985px"
        // minH="543px"
        mt="164px"
        p="1.5rem 2rem"
        bg={colorMode === "dark" ? "fadeD" : "fadeL"}
        borderTopLeftRadius="64px"
        borderTopRightRadius="64px"
      >
        <VStack justifyContent="center">
          <VStack mb="18px">
            {/* <Box> */}
            <Heading
              as="h1"
              display="inline-block"
              fontFamily="roboto"
              fontStyle="italic"
              fontWeight="700"
              fontSize={isSmallerThan600 ? "34px" : "50px"}
              color="p500"
              textAlign="center"
              maxW={isSmallerThan378 && "120px"}
            >
              <chakra.span
                fontFamily="heading"
                fontStyle="normal"
                fontSize={isSmallerThan600 ? "48px" : "64px"}
                color="r500"
              >
                Quest
              </chakra.span>{" "}
              Casino
              <chakra.hr
                position="relative"
                bottom="6px"
                h={isSmallerThan600 ? "4.5px" : "7.5px"}
                bg="linear-gradient(90.03deg, #E35855 0%, #FFBB00 65.91%, #FFBB00 100.98%)"
                borderRadius="2rem"
                border="0px"
              />
            </Heading>
            {/* </Box> */}
            <Heading
              fontFamily="body"
              fontSize={isSmallerThan600 ? "32px" : "48px"}
              fontWeight="400"
              color={colorMode === "dark" ? "dwordMain" : "bMain"}
              textAlign="center"
              mt="2px !important"
            >
              Home of{" "}
              <chakra.span
                display="inline-block"
                fontStyle="italic"
                fontWeight="600"
              >
                Blackjack
                <chakra.hr
                  position="relative"
                  justifySelf="flex-end"
                  // bottom="6px"
                  right="0"
                  h="4px"
                  w="96%"
                  bg={
                    colorMode === "dark"
                      ? "linear-gradient(90deg, rgba(244, 244, 244, 0) 14.73%, #F4F4F4 100.98%)"
                      : "linear-gradient(90deg, rgba(54, 54, 54, 0) 14.73%, #363636 100.98%)"
                  }
                  borderRadius="2rem"
                  border="0px"
                />
              </chakra.span>
            </Heading>
          </VStack>

          <Text textAlign="center" maxW="732px" mb="3rem !important">
            Welcome to Quest Casino, where the fun never stops! We offer the
            best blackjack tables, exciting slot machines, and thrilling games.
            Your safety is our top priority, and we have taken every precaution
            to ensure your peace of mind. Our friendly staff is here to help
            make your visit a memorable one. Come experience the excitement for
            yourself and see why Quest Casino is the place to be!
          </Text>

          <Grid
            w="100%"
            maxW="732px"
            templateColumns="repeat(3, 1fr)"
            gap="1rem"
            justifyItems="center"
          >
            <VStack maxW="180px">
              <Heading
                fontFamily="body"
                fontSize="24px"
                fontWeight="600"
                color={colorMode === "dark" ? "dwordMain" : "bMain"}
              >
                Games
              </Heading>
              <Text fontSize="13px" textAlign="center">
                Classic table games like blackjack and poker, even slot machines
                and more!
              </Text>
              <Icon as={CgCardSpades} fontSize="1.5rem" color="g500" />
            </VStack>
            <VStack maxW="180px">
              <Heading
                fontFamily="body"
                fontSize="24px"
                fontWeight="600"
                color={colorMode === "dark" ? "dwordMain" : "bMain"}
              >
                Challenges
              </Heading>
              <Text fontSize="13px" textAlign="center">
                Challenges are the quests you can fulfil for some extra cash! Or
                other special rewards.
              </Text>
              <Icon as={AiOutlineTrophy} fontSize="1.5rem" color="g500" />
            </VStack>
            <VStack maxW="180px">
              <Heading
                fontFamily="body"
                fontSize="24px"
                fontWeight="600"
                color={colorMode === "dark" ? "dwordMain" : "bMain"}
              >
                Safety
              </Heading>
              <Text fontSize="13px" textAlign="center">
                Our top priority is your safety and comfort even though there is
                no danger! This is all for fun!
              </Text>
              <Icon as={AiOutlineSafety} fontSize="1.5rem" color="g500" />
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </>
  );
};

export default WelcomeSection;
