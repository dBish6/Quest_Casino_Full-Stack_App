import { useState } from "react";

// *Design Imports*
import {
  HStack,
  Box,
  VStack,
  Icon,
  Image,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { MdMenu, MdLockOutline } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import QuestCasinoDiceDARK from "../../../assets/Dice.png";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion } from "framer-motion";

// *Component Imports*
import PopOutMenu from "./PopOutMenu";

// This is the mobile sidebar for phones and tablets:)
const MobileIndex = (props) => {
  const [iconSelected, setIconSelected] = useState({
    navigation: false,
    login: false,
    settings: false,
  });
  const [show, setShow] = useState({
    navigation: false,
    login: false,
    settings: false,
  });
  const { colorMode } = useColorMode();

  return (
    <>
      <VStack
        as={motion.div}
        animate={
          props.showSideBar
            ? {
                opacity: 1,
                width: "60px",
                transition: { duration: 0.6, type: "spring" },
              }
            : {
                opacity: 0,
                width: 0,
                transition: { duration: 0.7, type: "tween" },
              }
        }
        initial={{
          opacity: 1,
          width: "60px",
        }}
        bgColor={colorMode === "dark" ? "bd700" : "bl400"}
        minH="100vh"
      >
        <VStack
          as={motion.div}
          animate={
            props.showSideBar
              ? {
                  opacity: 1,
                  transition: { duration: 0.6 },
                }
              : {
                  opacity: 0,
                  transition: { duration: 0.2 },
                }
          }
          m="1rem"
          gap="0.5rem"
        >
          <Icon
            as={MdMenu}
            onClick={() => {
              setIconSelected({
                navigation: !iconSelected.navigation,
                login: false,
                settings: false,
              });
              setShow({
                navigation: !show.navigation,
                login: false,
                settings: false,
              });
            }}
            variant={iconSelected.navigation ? "navOnLocation" : "navigation"}
            cursor="pointer"
          />
          <Icon
            as={MdLockOutline}
            onClick={() => {
              setIconSelected({
                navigation: false,
                login: !iconSelected.login,
                settings: false,
              });
              setShow({
                navigation: false,
                login: !show.login,
                settings: false,
              });
            }}
            variant={iconSelected.login ? "navOnLocation" : "navigation"}
            cursor="pointer"
          />
          <Icon
            as={FiSettings}
            onClick={() => {
              setIconSelected({
                navigation: false,
                login: false,
                settings: !iconSelected.settings,
              });
              setShow({
                navigation: false,
                login: false,
                settings: !show.settings,
              });
            }}
            variant={iconSelected.settings ? "navOnLocation" : "navigation"}
            cursor="pointer"
            mt="0.8rem !important"
          />
        </VStack>
        <Image src={QuestCasinoDiceDARK} w="34px" h="29px" />
      </VStack>
      <IconButton
        as={motion.button}
        animate={
          props.showSideBar
            ? {
                x: "35px",
                rotate: "90deg",
                transition: { duration: 0.2, type: "spring" },
              }
            : {
                x: "-16px",
                rotate: "90deg",
                transition: { duration: 0.38, type: "tween" },
              }
        }
        initial={{
          x: "35px",
          rotate: "90deg",
        }}
        icon={
          props.showSideBar ? (
            <MdExpandMore fontSize="52px" />
          ) : (
            <MdExpandLess fontSize="52px" />
          )
        }
        onClick={() => props.setShowSideBar(!props.showSideBar)}
        position="absolute"
        top="50%"
        size="sm"
        zIndex="sticky"
      />

      <PopOutMenu show={show} setShow={setShow} />
    </>
  );
};

export default MobileIndex;
