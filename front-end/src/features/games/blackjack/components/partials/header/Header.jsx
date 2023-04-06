import { useState } from "react";
import { useNavigate } from "react-router-dom";

// *Design Imports*
import { chakra, Heading, Text, VStack, Box, Link } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import fadeUp from "../../../utils/animations/menuFadeUp";

// *Component Imports*
import GetBalance from "../../../../../../components/GetBalance";

const Header = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
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
        lineHeight="1.2"
      >
        Davy Blackjack
      </Heading>

      <chakra.nav display="flex" alignItems="center" gap="1rem">
        {props.gameType === "Match" && (
          <GetBalance variant="blackjack" fontSize="20px" />
        )}

        {/* Hamburger and Dropdown */}
        <VStack position="relative" w="max-content">
          <VStack
            as={motion.div}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Menu"
            gap={!showDropdown && "6.5px"}
            cursor="pointer"
            w="2rem"
          >
            <Box
              as={motion.div}
              animate={{
                rotate: showDropdown ? "40deg" : 0,
                translateY: showDropdown ? 3 : 0,
                transition: {
                  type: "spring",
                  duration: 0.5,
                  stiffness: 260,
                  damping: 20,
                },
              }}
              w="100%"
              h="4px"
              bgColor="wMain"
              borderRadius="1rem"
            />
            <Box
              as={motion.div}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: showDropdown ? 0 : 1,
                scale: showDropdown ? 0.2 : 1,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              }}
              w="100%"
              h="4px"
              mt="0 !important"
              bgColor="wMain"
              borderRadius="1rem"
            />
            <Box
              as={motion.div}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                rotate: showDropdown ? "-40deg" : 0,
                translateY: showDropdown ? -4 : 0,
                transition: {
                  type: "spring",
                  duration: 0.38,
                  stiffness: 260,
                  damping: 20,
                },
              }}
              w="100%"
              h="4px"
              mt="0 !important"
              bgColor="wMain"
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
                  onClick={() => props.setShow({ ...props.show, cashIn: true })}
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
                    props.setShow({
                      ...props.show,
                      gameStart: true,
                      canCancel: true,
                    })
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
                  onClick={() => props.setShow({ ...props.show, rules: true })}
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
  );
};

export default Header;
