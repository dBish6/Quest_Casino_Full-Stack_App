/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

// *Design Imports*
import {
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
import PopOutMenus from "./PopOutMenus";
import QuestsModal from "../../../features/quests/components/modals/QuestsModal";
import PasswordResetModal from "../../../features/authentication/components/modals/PasswordResetModal";
import RegisterModal from "../../../features/authentication/components/modals/RegisterModal";

// This is the mobile sidebar for phones and tablets:)
const MobileIndex = () => {
  const [showSideBar, setShowSideBar] = useState(true);
  const [iconSelected, setIconSelected] = useState({
    navigation: false,
    login: false,
    settings: false,
  });
  const [show, setShow] = useState({
    navigation: false,
    quests: false,
    login: false,
    passwordReset: false,
    register: false,
    settings: false,
  });
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!showSideBar) {
      setShow({
        ...show,
        navigation: false,
        login: false,
        settings: false,
      });
      setIconSelected({
        navigation: false,
        login: false,
        settings: false,
      });
    }
  }, [showSideBar]);

  return (
    <>
      <VStack
        as={motion.aside}
        animate={
          showSideBar
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
        pos="fixed"
        minH="100vh"
        bgColor={colorMode === "dark" ? "bd700" : "bl400"}
        borderRightWidth="1px"
        borderColor={
          colorMode === "dark" ? "rgba(244, 244, 244, 0.1)" : "borderL"
        }
        zIndex="sticky"
      >
        <VStack
          as={motion.div}
          animate={
            showSideBar
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
                ...show,
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
                ...show,
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
                ...show,
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
        <Image
          src={QuestCasinoDiceDARK}
          alt="Quest Casino Small Logo"
          w="48px"
          h="42px"
        />

        <PopOutMenus
          showSideBar={showSideBar}
          setShowSideBar={setShowSideBar}
          show={show}
          setShow={setShow}
        />
      </VStack>

      <IconButton
        as={motion.button}
        animate={
          showSideBar
            ? {
                x: "32px",
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
          x: "32px",
          rotate: "90deg",
        }}
        icon={
          showSideBar ? (
            <MdExpandMore fontSize="52px" />
          ) : (
            <MdExpandLess fontSize="52px" />
          )
        }
        onClick={() => {
          setShowSideBar(!showSideBar);
        }}
        position="fixed"
        top="50%"
        size="sm"
        zIndex="sticky"
      />

      <QuestsModal show={show} setShow={setShow} />
      <PasswordResetModal show={show} setShow={setShow} />
      <RegisterModal show={show} setShow={setShow} />
    </>
  );
};

export default MobileIndex;
