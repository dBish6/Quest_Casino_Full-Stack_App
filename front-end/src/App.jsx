/* Quest Casino

   Author: David Bishop
   Creation Date: February 4, 2023
*/

import { useState } from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Grid, useMediaQuery } from "@chakra-ui/react";

import PrivateRoute from "./features/authentication/PrivateRoute";

// *Context Import*
import { AuthProvider } from "./features/authentication/contexts/AuthContext";

// *Design Imports*
import { chakra, Image, useColorMode } from "@chakra-ui/react";

// *Component Imports*
import DesktopSidebar from "./components/sideBar";
import MobileSidebar from "./components/sideBar/mobile";
import NavBar from "./components/partials/NavBar";

// *Feature Imports*
import RegisterModel from "./features/authentication/components/modals/RegisterModel";
import PasswordResetModel from "./features/authentication/components/modals/PasswordResetModel";

// *Pages/Views*
import Home from "./pages/Home";
import About from "./pages/About";
import Support from "./pages/Support";
import Profile from "./pages/Profile";

import GamesHome from "./pages/games/GamesHome";
import Blackjack from "./pages/games/Blackjack";
import BlackjackTest from "./features/games/blackjack/test";

import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";

const ShowPartials = () => {
  const [isLargerThan1027] = useMediaQuery("(min-width: 1027px)");
  const [showSideBar, setShowSideBar] = useState(true);
  const { colorMode } = useColorMode();

  return (
    <>
      {/* Nested routes render out here. */}
      <Grid
        templateColumns={isLargerThan1027 ? "235px 1fr" : "max-content 1fr"}
      >
        {isLargerThan1027 ? (
          <chakra.aside
            bgColor={colorMode === "dark" ? "bd700" : "bl400"}
            minH="100vh"
            // borderRight={
            //   colorMode === "dark"
            //     ? "1px solid borderD"
            //     : "1px solid borderL"
            // }
          >
            <DesktopSidebar />
          </chakra.aside>
        ) : (
          <MobileSidebar
            showSideBar={showSideBar}
            setShowSideBar={setShowSideBar}
          />
        )}

        {/* FIXME: overflow */}
        <chakra.main
          p={{ base: "1.5rem 1rem", md: "1.5rem 2rem", xl: "1.5rem 2rem" }}
          overflowX="hidden"
        >
          <NavBar />
          <Outlet />
        </chakra.main>
      </Grid>
      {/* <Footer /> */}
    </>
  );
};

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ShowPartials />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home title="Home" />} />
            <Route path="/about" element={<About title="About Us" />} />
            <Route path="/support" element={<Support title="Support" />} />
            <Route
              path="/user/profile"
              element={
                <PrivateRoute>
                  <Profile title="Profile" />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/forgotPassword"
              element={<PasswordResetModel title="Forgot" />}
            />
            <Route path="/games" element={<GamesHome title="Games" />} />

            <Route path="/error404" element={<Error404 title="ERROR" />} />
            <Route path="/error500" element={<Error500 title="ERROR" />} />
            <Route path="*" element={<Navigate to="/error404" />} />

            <Route path="/register" element={<RegisterModel />} />
          </Route>

          <Route
            path="/games/blackjack"
            element={<Blackjack title="Blackjack" />}
          />
          <Route
            path="/games/blackjack/test"
            element={<BlackjackTest title="Blackjack Test" />}
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
