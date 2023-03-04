import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import { Box, VStack, Link, useColorMode } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Component Imports*
import Header from "../../../components/Header";
import LoginForm from "../../../features/authentication/components/LoginForm";
import Settings from "../Settings";

const PopOutMenu = (props) => {
  const { colorMode } = useColorMode();
  const location = useLocation();

  return (
    <AnimatePresence>
      {props.show.navigation && (
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
          key="navigation"
          position="absolute"
          top="0"
          left="60px"
          marginInlineStart="0 !important"
          zIndex="dropdown"
          bgColor={
            colorMode === "dark"
              ? "rgba(66, 75, 94, 0.7)"
              : "rgba(117, 119, 125, 0.7)"
          }
          borderLeftWidth="2px"
          borderLeftColor={colorMode === "dark" ? "borderD" : "borderL"}
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
            <Header fontSize="24px" text="Navigation" mb="0.5rem" />
            <Link
              as={NavLink}
              to="/home"
              variant={
                location.pathname === "/home" ? "navOnLocation" : "navigation"
              }
            >
              Home
            </Link>
            <Link
              as={NavLink}
              to="/games"
              variant={
                location.pathname === "/games" ? "navOnLocation" : "navigation"
              }
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
              mt="0.875rem !important"
            >
              Profile
            </Link>
            <Link
              as={NavLink}
              to="/games/favorites"
              variant={
                location.pathname === "/games/favorites"
                  ? "navOnLocation"
                  : "navigation"
              }
              mt="0.875rem !important"
            >
              Favorites
            </Link>
            <Link
              as={NavLink}
              to="/about"
              variant={
                location.pathname === "/about" ? "navOnLocation" : "navigation"
              }
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
          // FIXME:
          exit={{
            opacity: 0,
            width: 0,
            // overflow: "none",
            transition: { duration: 0.7, type: "tween" },
          }}
          key="login"
          position="absolute"
          top="0"
          left="60px"
          marginInlineStart="0 !important"
          zIndex="dropdown"
          bgColor={
            colorMode === "dark"
              ? "rgba(66, 75, 94, 0.7)"
              : "rgba(117, 119, 125, 0.7)"
          }
          borderLeftWidth="2px"
          borderLeftColor={colorMode === "dark" ? "borderD" : "borderL"}
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
            <Header fontSize="28px" text="Log In" mb="1.5rem" />
            <LoginForm mobile={true} />
          </VStack>
        </Box>
      )}

      {props.show.settings && (
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
          key="settings"
          position="absolute"
          top="0"
          left="60px"
          marginInlineStart="0 !important"
          zIndex="dropdown"
          bgColor={
            colorMode === "dark"
              ? "rgba(66, 75, 94, 0.7)"
              : "rgba(117, 119, 125, 0.7)"
          }
          borderLeftWidth="2px"
          borderLeftColor={colorMode === "dark" ? "borderD" : "borderL"}
          borderBottomEndRadius="6px"
        >
          <VStack
            as={motion.div}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            key="settingsContent"
            padding="1rem"
          >
            <Settings />
          </VStack>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default PopOutMenu;
