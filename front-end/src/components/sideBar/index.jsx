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
  useColorMode,
} from "@chakra-ui/react";
import { MdMenu, MdLockOutline } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import QuestCasinoLogoDARK from "../../assets/QuestCasinoLogo-Dark-FreeLogoDesign.png";
import QuestCasinoLogoLIGHT from "../../assets/QuestCasinoLogo-Light-FreeLogoDesign.png";

// *Component Imports*
import Header from "../Header";
import Navigation from "./Navigation";
import Settings from "./Settings";
// import UserList from "./UserList";

// *Feature Import*
import LoginForm from "../../features/authentication/components/LoginForm";

const Nav = () => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Tabs>
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
          <TabPanel
          // h="100vh"
          // justifyContent="space-between"
          >
            <Header fontSize="28px" text="Navigation" mb="1rem" />
            <Container
              display="flex"
              flexDir="column"
              alignItems="center"
              position="relative"
              right="12px"
            >
              <Navigation />
            </Container>

            <Container
              display="flex"
              flexDir="column"
              alignItems="center"
              minH="452.6px"
            >
              <Header fontSize="28px" text="Players" mt="1rem" mb="1rem" />
              {/* <UserList /> */}
            </Container>
            <Flex justifyContent="center">
              <Image
                src={
                  colorMode === "dark"
                    ? QuestCasinoLogoDARK
                    : QuestCasinoLogoLIGHT
                }
                maxW="203px"
                minH="203px"
              />
            </Flex>
          </TabPanel>

          <TabPanel>
            <Header fontSize="28px" text="Log In" mb="1.5rem" />
            <LoginForm />
            <Flex justifyContent="center" mt="1.5rem">
              <Image
                src={
                  colorMode === "dark"
                    ? QuestCasinoLogoDARK
                    : QuestCasinoLogoLIGHT
                }
                maxW="203px"
                minH="203px"
              />
            </Flex>
          </TabPanel>

          <TabPanel>
            <Settings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Nav;
