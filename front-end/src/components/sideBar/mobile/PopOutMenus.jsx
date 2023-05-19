import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import { Box, VStack, Link, useColorMode } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Component Imports*
import MyHeading from "../../MyHeading";
import LoginForm from "../../../features/authentication/components/LoginForm";
import Settings from "../Settings";

const PopOutMenus = (props) => {
  const { colorMode } = useColorMode();
  const location = useLocation();

  return (
    <AnimatePresence>
      {props.show.navigation && (
        <Box
          as={motion.div}
          animate={{
            opacity: 1,
            width: "max-content",
            transition: { duration: 0.6, type: "spring" },
          }}
          initial={{ opacity: 0, width: 0 }}
          exit={{
            opacity: 0,
            width: 0,
            transition: { duration: 0.7, type: "tween" },
          }}
          key="navigation"
          position="absolute"
          top="0"
          left="60px"
          m="0 !important"
          zIndex="sticky"
          bgColor={colorMode === "dark" ? "bd700" : "bl400"}
          borderLeftWidth="1px"
          borderRightWidth="1px"
          borderBottomWidth="1px"
          borderColor={colorMode === "dark" ? "borderD" : "borderL"}
          borderBottomEndRadius="6px"
        >
          <VStack
            as={motion.div}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            key="navContent"
            padding="1rem"
          >
            <MyHeading
              fontSize="24px"
              text="Navigation"
              textShadow={colorMode === "light" && "1px 1px 0px #363636"}
              whiteSpace="nowrap"
              mb="0.5rem"
            />
            <Link
              as={NavLink}
              to="/home"
              variant={
                location.pathname === "/home" ? "navOnLocation" : "navigation"
              }
              whiteSpace="nowrap"
            >
              Home
            </Link>
            <Link
              as={NavLink}
              to="/games"
              variant={
                location.pathname === "/games" ? "navOnLocation" : "navigation"
              }
              whiteSpace="nowrap"
              mt="0.875rem !important"
            >
              Games
            </Link>
            <Link
              as={NavLink}
              to="/user/profile"
              variant={
                location.pathname === "/user/profile"
                  ? "navOnLocation"
                  : "navigation"
              }
              whiteSpace="nowrap"
              mt="0.875rem !important"
            >
              Profile
            </Link>
            <Link
              onClick={() => props.setShow({ ...props.show, quests: true })}
              variant={props.show.quests ? "navOnLocation" : "navigation"}
              whiteSpace="nowrap"
              mt="0.875rem !important"
            >
              Quests
            </Link>
            <Link
              as={NavLink}
              to="/about"
              variant={
                location.pathname === "/about" ? "navOnLocation" : "navigation"
              }
              whiteSpace="nowrap"
              mt="0.875rem !important"
            >
              About Us
            </Link>
            <Link
              as={NavLink}
              to="/support"
              variant={
                location.pathname === "/support"
                  ? "navOnLocation"
                  : "navigation"
              }
              whiteSpace="nowrap"
              mt="0.875rem !important"
            >
              Support
            </Link>
          </VStack>
        </Box>
      )}

      {props.show.login && (
        <Box
          as={motion.div}
          animate={{
            opacity: 1,
            width: "fit-content",
            transition: { duration: 0.6, type: "spring" },
          }}
          initial={{ opacity: 0, width: 0 }}
          exit={{
            opacity: 0,
            width: 0,
            transition: { duration: 0.7, type: "tween" },
          }}
          key="login"
          position="absolute"
          top="0"
          left="60px"
          m="0 !important"
          zIndex="sticky"
          bgColor={colorMode === "dark" ? "bd700" : "bl400"}
          borderLeftWidth="1px"
          borderRightWidth="1px"
          borderBottomWidth="1px"
          borderColor={colorMode === "dark" ? "borderD" : "borderL"}
          borderBottomEndRadius="6px"
        >
          <VStack
            as={motion.div}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            key="loginContent"
            padding="1rem"
          >
            <MyHeading
              fontSize="28px"
              text="Log In"
              textShadow={colorMode === "light" && "1px 1px 0px #363636"}
              whiteSpace="nowrap"
              mb="1.5rem"
            />
            <LoginForm
              show={props.show}
              setShow={props.setShow}
              mobile={true}
            />
          </VStack>
        </Box>
      )}

      {props.show.settings && (
        <Box
          as={motion.div}
          animate={{
            opacity: 1,
            width: "max-content",
            transition: { duration: 0.6, type: "spring" },
          }}
          initial={{ opacity: 0, width: 0 }}
          exit={{
            opacity: 0,
            width: 0,
            transition: { duration: 0.7, type: "tween" },
          }}
          key="settings"
          position="absolute"
          top="0"
          left="60px"
          m="0 !important"
          zIndex="sticky"
          bgColor={colorMode === "dark" ? "bd700" : "bl400"}
          borderLeftWidth="1px"
          borderRightWidth={colorMode === "light" && "1px"}
          borderBottomWidth={colorMode === "light" && "1px"}
          borderColor={colorMode === "dark" ? "borderD" : "borderL"}
          borderBottomEndRadius="6px"
        >
          <VStack
            as={motion.div}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            key="settingsContent"
            align="flex-start"
            padding="1rem"
          >
            <Settings />
          </VStack>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default PopOutMenus;
