import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// *Design Imports*
import { chakra, Heading, Text, VStack, Box, Link } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeUp from "../../../utils/animations/menuFadeUp";

// *Component Imports*
import RulesOverlay from "../../RulesOverlay";

const Header = (props) => {
  const [showRules, setShowRules] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameTypeChanged, setGameTypeChanged] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setGameTypeChanged(props.gameType);
  }, [props.gameType]);

  return (
    <>
      <chakra.header
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb="1.5rem"
      >
        <Heading
          as="h1"
          variant="blackjack"
          fontSize="40px"
          fontFamily="heading"
        >
          Davy Blackjack
        </Heading>

        <chakra.nav display="flex" alignItems="center" gap="1rem">
          {gameTypeChanged === "Match" && props.wallet !== null && (
            <Text variant="blackjack" fontSize="20px">
              Balance:{" "}
              <chakra.span color="g500" fontWeight="500">
                ${props.wallet}
              </chakra.span>
            </Text>
          )}

          {/* Hamburger and Dropdown */}
          <VStack position="relative" w="max-content">
            <VStack
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Menu"
              gap="6.5px"
              cursor="pointer"
              w="2rem"
            >
              <Box
                as={motion.div}
                // FIXME: Shit animation.
                animate={
                  showDropdown
                    ? {
                        rotate: "40deg",
                        transition: { duration: 0.5 },
                        // originX: "50%",
                        // originY: "50%",
                        position: "absolute",
                      }
                    : {
                        rotate: 0,
                        // transition: { duration: 0.5 },
                        // originX: "50%",
                        // originY: "50%",
                        transitionEnd: { position: "initial" },
                      }
                }
                // position={showDropdown && "absolute"}
                // transformOrigin="bottom left"
                w="100%"
                h="4px"
                bgColor="wMain"
                // boxShadow="0px 0px 0px 1px #000000"
                borderRadius="1rem"
              />
              <Box
                as={motion.div}
                animate={
                  showDropdown
                    ? {
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }
                    : {
                        opacity: 1,
                        transition: { duration: 0.2 },
                      }
                }
                w="100%"
                h="4px"
                mt="0 !important"
                bgColor="wMain"
                // boxShadow="0px 0px 0px 1px #000000"
                borderRadius="1rem"
              />
              <Box
                as={motion.div}
                animate={
                  showDropdown
                    ? {
                        rotate: "-40deg",
                        transition: { duration: 0.5 },
                        // originX: "50%",
                        // originY: "50%",
                        position: "absolute",
                      }
                    : {
                        rotate: 0,
                        // transition: { duration: 0.5 },
                        // originX: "50%",
                        // originY: "50%",
                        transitionEnd: { position: "initial" },
                      }
                }
                // initial={{ rotate: 0 }}
                // position={showDropdown && "absolute"}
                // transformOrigin="top left"
                w="100%"
                h="4px"
                mt="0 !important"
                bgColor="wMain"
                // boxShadow="0px 0px 0px 1px #000000"
                borderRadius="1rem"
              />
            </VStack>
            <AnimatePresence>
              {showDropdown && (
                <VStack
                  as={motion.div}
                  variants={fadeUp}
                  animate="visible"
                  initial="hidden"
                  exit="hidden"
                  position="absolute"
                  top="1.5rem"
                  w="140px"
                  bgColor="rgba(244, 244, 244, 0.5)"
                  borderWidth="1px"
                  borderColor="rgb(0, 0, 0)"
                  borderRadius="6px"
                  zIndex="dropdown"
                >
                  <Link
                    data-group
                    onClick={() => navigate(-1)}
                    w="100%"
                    textAlign="center"
                    borderTopRadius="6px"
                    p="6px 0"
                    _hover={{
                      bgColor: "rgba(244, 244, 244, 0.6)",
                    }}
                  >
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      color="wMain"
                      opacity="0.8"
                      textShadow="1px 1px 0px #000"
                      _groupHover={{
                        opacity: "1",
                        textShadow: "1px 1px 0px #000",
                      }}
                    >
                      Go Back
                    </Text>
                  </Link>

                  <Link
                    data-group
                    onClick={() => props.setShow({ cashIn: true })}
                    w="100%"
                    textAlign="center"
                    p="6px 0"
                    m="0 !important"
                    _hover={{
                      bgColor: "rgba(244, 244, 244, 0.6)",
                    }}
                  >
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      color="wMain"
                      opacity="0.8"
                      textShadow="1px 1px 0px #000"
                      _groupHover={{
                        opacity: "1",
                        textShadow: "1px 1px 0px #000",
                      }}
                    >
                      Cash In
                    </Text>
                  </Link>

                  <Link
                    data-group
                    onClick={() =>
                      props.setShow((prev) => ({
                        ...prev,
                        gameStart: true,
                        canCancel: true,
                      }))
                    }
                    w="100%"
                    textAlign="center"
                    p="6px 0"
                    m="0 !important"
                    _hover={{
                      bgColor: "rgba(244, 244, 244, 0.6)",
                    }}
                  >
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      color="wMain"
                      opacity="0.8"
                      textShadow="1px 1px 0px #000"
                      _groupHover={{
                        opacity: "1",
                        textShadow: "1px 1px 0px #000",
                      }}
                    >
                      Change Mode
                    </Text>
                  </Link>

                  <Link
                    data-group
                    onClick={() => setShowRules(true)}
                    w="100%"
                    textAlign="center"
                    borderBottomRadius="6px"
                    p="6px 0"
                    m="0 !important"
                    _hover={{
                      bgColor: "rgba(244, 244, 244, 0.6)",
                    }}
                  >
                    <Text
                      fontSize="18px"
                      fontWeight="500"
                      color="wMain"
                      opacity="0.8"
                      textShadow="1px 1px 0px #000"
                      _groupHover={{
                        opacity: "1",
                        textShadow: "1px 1px 0px #000",
                      }}
                    >
                      Rules
                    </Text>
                  </Link>
                </VStack>
              )}
            </AnimatePresence>
          </VStack>
        </chakra.nav>
      </chakra.header>

      <RulesOverlay showRules={showRules} setShowRules={setShowRules} />
    </>
  );
};

export default Header;
