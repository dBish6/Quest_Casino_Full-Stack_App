// *Design Imports*
import {
  Image,
  Container,
  Box,
  Heading,
  chakra,
  Text,
  VStack,
  Icon,
  useColorMode,
  Grid,
  useMediaQuery,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import cardsImg from "../../assets/cards-pngwing.com.png";
import { CgCardSpades } from "react-icons/cg";
import { AiOutlineTrophy, AiOutlineSafety } from "react-icons/ai";

const WelcomeSection = () => {
  const { colorMode } = useColorMode();
  const [isSmallerThan601] = useMediaQuery("(max-width: 601px)");
  const [isSmallerThan410] = useMediaQuery("(max-width: 410px)");

  return (
    <>
      <Box pos="relative" maxW="985px" m="0 auto" mt="164px">
        <Image
          src={cardsImg}
          alt="Hand of Cards"
          as={motion.img}
          initial={{
            scale: isSmallerThan601 ? 0.7 : 0.8,
            rotate: "10.58deg",
            opacity: 0,
          }}
          whileInView={{
            scale: isSmallerThan601 ? 0.9 : 1,
            rotate: "18.58deg",
            opacity: 1,
            transition: {
              delay: 0.95,
              opacity: { duration: 0.2 },
            },
          }}
          viewport={{ width: window.innerWidth, height: window.innerHeight }}
          position="absolute"
          top="-140px"
          right="-116px"
          maxW="297px"
          minH="306px"
        />
      </Box>

      <Container
        aria-label="Welcoming"
        as={motion.section}
        initial={{ height: 0, opacity: 0, y: "50%" }}
        whileInView={{
          height: "max-content",
          opacity: 1,
          y: "0",
          transition: { duration: 1 },
        }}
        viewport={{ width: window.innerWidth, height: window.innerHeight }}
        pos="relative"
        maxW="985px"
        mt="164px"
        p={isSmallerThan410 ? "1.5rem 1rem 3rem 1rem" : "1.5rem 2rem 3rem 2rem"}
        bg={colorMode === "dark" ? "fadeD" : "fadeL"}
        borderTopLeftRadius="64px"
        borderTopRightRadius="64px"
        zIndex="1"
      >
        <VStack justifyContent="center">
          <VStack mb="1.5rem">
            <Heading
              as="h1"
              display="inline-block"
              fontFamily="roboto"
              fontStyle="italic"
              fontWeight="700"
              fontSize={
                isSmallerThan410 ? "32px" : isSmallerThan601 ? "40px" : "50px"
              }
              lineHeight="1.2"
              textShadow={colorMode === "light" && "1px 1px 0px #363636"}
              color="p500"
              textAlign="center"
            >
              <chakra.span
                fontFamily="heading"
                fontStyle="normal"
                fontSize={
                  isSmallerThan410 ? "46px" : isSmallerThan601 ? "54px" : "64px"
                }
                color="r500"
              >
                Quest
              </chakra.span>{" "}
              Casino
              <chakra.hr
                position="relative"
                bottom="6px"
                h={isSmallerThan601 ? "4.5px" : "7.5px"}
                bg="linear-gradient(90.03deg, #E35855 0%, #FFBB00 65.91%, #FFBB00 100.98%)"
                borderRadius="2rem"
                border="0px"
              />
            </Heading>
            <Heading
              fontFamily="body"
              fontSize={
                isSmallerThan410 ? "30px" : isSmallerThan601 ? "38px" : "48px"
              }
              fontWeight="400"
              color={colorMode === "dark" ? "wMain" : "bMain"}
              lineHeight="1.2"
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

          <Text
            aria-label="Casino Welcome Text"
            textAlign="center"
            lineHeight="1.725"
            maxW="732px"
            m="0 0 3rem 0 !important"
          >
            Welcome to Quest Casino, where the fun never stops! We offer the
            best blackjack tables, exciting slot machines, and thrilling games.
            Your safety is our top priority, and we have taken every precaution
            to ensure your peace of mind. Our friendly staff is here to help
            make your visit a memorable one. Come experience the excitement for
            yourself and see why Quest Casino is the place to be!
          </Text>

          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            gap="2rem"
            justifyItems="center"
            w="100%"
            maxW="732px"
            m="0 !important"
          >
            <VStack maxW="180px" maxH="127.3px">
              <Heading
                fontFamily="body"
                fontSize={isSmallerThan601 ? "21px" : "24px"}
                fontWeight="600"
                lineHeight="1.2"
                color={colorMode === "dark" ? "wMain" : "bMain"}
              >
                Games
              </Heading>
              <Text
                aria-label="Game's Offering"
                fontSize="13px"
                textAlign="center"
                opacity="0.9"
              >
                Classic table games like blackjack and poker, even slot machines
                and more!
              </Text>
              <Icon
                aria-label="Card"
                as={CgCardSpades}
                fontSize="1.5rem"
                color="g500"
              />
            </VStack>
            <VStack maxW="180px" maxH="127.3px">
              <Heading
                fontFamily="body"
                fontSize={isSmallerThan601 ? "21px" : "24px"}
                fontWeight="600"
                lineHeight="1.2"
                color={colorMode === "dark" ? "wMain" : "bMain"}
              >
                Challenges
              </Heading>
              <Text
                aria-label="Challenges Offering"
                fontSize="13px"
                textAlign="center"
                opacity="0.9"
              >
                Challenges are the quests you can fulfil for some extra cash! Or
                other special rewards.
              </Text>
              <Icon
                aria-label="Trophy"
                as={AiOutlineTrophy}
                fontSize="1.5rem"
                color="g500"
              />
            </VStack>
            <VStack
              maxW="180px"
              maxH="127.3px"
              gridColumn={["1", "span 2", "3"]}
            >
              <Heading
                fontFamily="body"
                fontSize={isSmallerThan601 ? "21px" : "24px"}
                fontWeight="600"
                lineHeight="1.2"
                color={colorMode === "dark" ? "wMain" : "bMain"}
              >
                Safety
              </Heading>
              <Text
                aria-label="Safety Offering"
                fontSize="13px"
                textAlign="center"
                opacity="0.9"
              >
                Our top priority is your safety and comfort even though there is
                no danger! This is all for fun!
              </Text>
              <Icon
                aria-label="Shield"
                as={AiOutlineSafety}
                fontSize="1.5rem"
                color="g500"
              />
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </>
  );
};

export default WelcomeSection;
