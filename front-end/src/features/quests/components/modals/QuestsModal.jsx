import { useEffect } from "react";

// *Design Imports*
import {
  Container,
  Box,
  Heading,
  Button,
  HStack,
  Text,
  chakra,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CircularProgress,
  useColorMode,
  Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *API Services Imports*
import GetAllQuests from "../../api_services/GetAllQuests";

// *Component Imports*
import ModalBackdrop from "../../../../components/modals/ModalBackdrop";
import Header from "../../../../components/Header";

// *Animations*
const model = {
  visible: {
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 50 },
      opacity: { duration: 0.8 },
    },
  },
  hidden: {
    y: "-400%",
    x: "-50%",
    opacity: 0,
    transition: {
      duration: 0.8,
      type: "tween",
    },
  },
};

const QuestsModal = (props) => {
  const { colorMode } = useColorMode();
  const { quests, errorHandler, loading } = GetAllQuests();

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 810);
    }
  }, [props.show]);

  return (
    <>
      <AnimatePresence initial={false}>
        {props.show && (
          <>
            <ModalBackdrop
              show={props.show}
              setShow={props.setShow}
              type={typeof props.setShow === "object" ? "quests" : ""}
            />

            <Container
              as={motion.div}
              variants={model}
              animate="visible"
              initial="hidden"
              exit="hidden"
              key="modal"
              zIndex="modal"
              position="fixed"
              top="50%"
              left="50%"
              p="1.5rem"
              backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
              borderWidth="1px"
              borderColor={colorMode === "dark" ? "borderD" : "borderL"}
              borderRadius="6px"
            >
              <Button
                onClick={() =>
                  typeof props.setShow === "object"
                    ? props.setShow({ quests: false })
                    : props.setShow(false)
                }
                variant="exit"
                position="absolute"
                top="-8px"
                right="-8px"
              >
                &#10005;
              </Button>
              <Header fontSize="2rem" text="Quests" mb="4px" />
              <Text textAlign="center" mb="1.5rem">
                Here are the featured quests for you to complete, if you desire,
                to earn some extra cash!
              </Text>

              {loading ? (
                <Flex justify="center">
                  <CircularProgress
                    isIndeterminate
                    color={colorMode === "dark" ? "p300" : "r500"}
                    borderColor={colorMode === "light" && "bMain"}
                  />
                </Flex>
              ) : (
                <>
                  {errorHandler.unexpected ? (
                    <Alert status="error" variant="left-accent" mb="0.5rem">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Server Error 500</AlertTitle>
                        <AlertDescription>
                          Unexpected server error.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ) : errorHandler.notFound ? (
                    <Alert status="error" variant="left-accent" mb="0.5rem">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Server Error 404</AlertTitle>
                        <AlertDescription>
                          The server couldn't find any quests.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ) : undefined}
                  <HStack
                    justify="center"
                    align="flex-start"
                    // FIXME: Why does it wrap initially!
                    // flexWrap="wrap"
                    gap="1rem 1.5rem"
                    maxW="1000px"
                  >
                    {quests.map((quest, i) => {
                      return (
                        <Card key={i} variant="primary" maxW="225px">
                          <CardHeader>
                            <Heading
                              fontFamily="roboto"
                              // fontSize="26px"
                              fontSize="24px"
                              fontWeight="600"
                              fontStyle="italic"
                              // color={
                              //   colorMode === "dark" ? "dwordMain" : "bMain"
                              // }
                            >
                              {quest.title}
                            </Heading>
                          </CardHeader>
                          <Divider />
                          <CardBody>
                            <Text>{quest.description}</Text>
                          </CardBody>
                          <CardFooter>
                            <Text fontSize="18px" fontWeight="500">
                              Reward:{" "}
                              <chakra.span
                                fontSize="16px"
                                fontWeight="600"
                                color="g500"
                              >
                                ${quest.reward}
                              </chakra.span>
                            </Text>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </HStack>
                </>
              )}
            </Container>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestsModal;
