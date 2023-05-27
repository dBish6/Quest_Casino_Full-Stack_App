import { useState } from "react";

// *Design Imports*
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Container,
  Flex,
  Image,
  chakra,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { MdMenu, MdLockOutline } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import QuestCasinoLogoDARK from "../../assets/QuestCasinoLogo-Dark-FreeLogoDesign.png";
import QuestCasinoLogoLIGHT from "../../assets/QuestCasinoLogo-Light-FreeLogoDesign.png";

// *API Services Import*
import GetPlayerHighlight from "../../features/authentication/api_services/GetPlayerHighlight";

// *Component Imports*
import MyHeading from "../MyHeading";
import Navigation from "./Navigation";
import LoginForm from "../../features/authentication/components/LoginForm";
import Settings from "./Settings";
import UserList from "./UserList";
import QuestsModal from "../../features/quests/components/modals/QuestsModal";
import PasswordResetModal from "../../features/authentication/components/modals/PasswordResetModal";
import RegisterModal from "../../features/authentication/components/modals/RegisterModal";

const DesktopIndex = () => {
  const [show, setShow] = useState({
    quests: false,
    passwordReset: false,
    register: false,
  });
  const [fsUsers, notFoundErr] = GetPlayerHighlight();
  const { colorMode } = useColorMode();
  const [isHeightSmallerThan935] = useMediaQuery("(max-height: 935px)");
  const [isHeightSmallerThan886] = useMediaQuery("(max-height: 886px)");

  return (
    <>
      <chakra.aside
        position="fixed"
        bgColor={colorMode === "dark" ? "bd700" : "bl400"}
        w="235px"
        minH="100vh"
      >
        <Tabs variant="navigation">
          <TabList justifyContent="space-evenly">
            <Tab flexGrow="1">
              <Icon as={MdMenu} fontSize="1.3125rem" />
            </Tab>
            <Tab flexGrow="1">
              <Icon as={MdLockOutline} fontSize="1.3125rem" />
            </Tab>
            <Tab flexGrow="1">
              <Icon as={FiSettings} fontSize="1.3125rem" />
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <MyHeading
                fontSize="28px"
                text="Navigation"
                textShadow={colorMode === "light" && "1px 1px 0px #363636"}
                mb="1rem"
              />
              <Container
                display="flex"
                flexDir="column"
                alignItems="center"
                position="relative"
                right="10px"
              >
                <Navigation show={show} setShow={setShow} />
              </Container>

              <Container
                display="flex"
                flexDir="column"
                alignItems="center"
                minH={!isHeightSmallerThan935 && "452.6px"}
                maxH={
                  isHeightSmallerThan886
                    ? "calc(452.6px - 48px * 2)"
                    : isHeightSmallerThan935 && "calc(452.6px - 48px)"
                }
                overflow={isHeightSmallerThan935 && "hidden"}
              >
                <MyHeading
                  fontSize="28px"
                  text="Players"
                  textShadow={colorMode === "light" && "1px 1px 0px #363636"}
                  mt="1rem"
                  mb="1rem"
                />
                <UserList fsUsers={fsUsers} notFoundErr={notFoundErr} />
              </Container>
              <Flex justifyContent="center">
                <Image
                  src={
                    colorMode === "dark"
                      ? QuestCasinoLogoDARK
                      : QuestCasinoLogoLIGHT
                  }
                  alt="Quest Casino Logo"
                  pos={fsUsers && fsUsers.length <= 5 && "absolute"}
                  bottom={fsUsers && fsUsers.length <= 5 && "0"}
                  maxW="203px"
                  minH="203px"
                />
              </Flex>
            </TabPanel>

            <TabPanel>
              <MyHeading
                fontSize="28px"
                text="Log In"
                textShadow={colorMode === "light" && "1px 1px 0px #363636"}
                mb="1.5rem"
              />
              <LoginForm show={show} setShow={setShow} />
              <Image
                src={
                  colorMode === "dark"
                    ? QuestCasinoLogoDARK
                    : QuestCasinoLogoLIGHT
                }
                alt="Quest Casino Logo"
                pos="absolute"
                bottom="0"
                maxW="203px"
                minH="203px"
              />
            </TabPanel>

            <TabPanel>
              <MyHeading
                fontSize="28px"
                text="Settings"
                textShadow={colorMode === "light" && "1px 1px 0px #363636"}
                mb="1.5rem"
              />
              <Settings />
              <Image
                src={
                  colorMode === "dark"
                    ? QuestCasinoLogoDARK
                    : QuestCasinoLogoLIGHT
                }
                alt="Quest Casino Logo"
                pos="absolute"
                bottom="0"
                maxW="203px"
                minH="203px"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </chakra.aside>

      <QuestsModal show={show} setShow={setShow} />
      <PasswordResetModal show={show} setShow={setShow} />
      <RegisterModal show={show} setShow={setShow} />
    </>
  );
};

export default DesktopIndex;
