// *Design Imports*
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Container,
  Image,
} from "@chakra-ui/react";
import { MdMenu, MdLockOutline } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import QuestCasinoLogoDARK from "../../assets/QuestCasinoLogo-Dark-FreeLogoDesign.png";
import QuestCasinoLogoLIGHT from "../../assets/QuestCasinoLogo-Light-FreeLogoDesign.png";
import { useColorMode } from "@chakra-ui/react";

// *Component Imports*
import Header from "./Header";
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
            display="flex"
            flexDir="column"
            // justifyContent="space-between"
          >
            <Header text="Navigation" />
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
              <Header text="Players" mt="1rem" />
              {/* <UserList /> */}
            </Container>
            <Image
              src={
                colorMode === "dark"
                  ? QuestCasinoLogoDARK
                  : QuestCasinoLogoLIGHT
              }
            />
          </TabPanel>

          <TabPanel>
            <Header text="Log In" />
            <LoginForm />
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
