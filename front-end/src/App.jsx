/* Quest Casino

   Author: David Bishop
   Creation Date: February 4, 2023
*/

import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Grid, useMediaQuery } from "@chakra-ui/react";

import PrivateRoute from "./features/authentication/PrivateRoute";

// *Context Import*
import { AuthProvider } from "./features/authentication/contexts/AuthContext";

// *Design Imports*
import { chakra, Image, useColorMode } from "@chakra-ui/react";

// *Component Imports*
import TabNav from "./components/sideBar";
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
import Favorites from "./pages/games/Favorites";
import Blackjack from "./pages/games/Blackjack";
import BlackjackTest from "./features/games/blackjack/test";

import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";

const ShowPartials = () => {
  const [isLargerThan1027] = useMediaQuery("(min-width: 1027px)");
  const { colorMode } = useColorMode();

  return (
    <>
      {/* Nested routes render out here. */}
      <Grid templateColumns="235px 1fr">
        <chakra.aside
          bgColor={colorMode === "dark" ? "bd700" : "bl400"}
          minH="100vh"
          // display={!isLargerThan1027 && "none"}
          // borderRight={
          //   colorMode === "dark"
          //     ? "1px solid rgba(244, 244, 244, 0.2)"
          //     : "1px solid rgba(54, 54, 54, 0.2)"
          // }
        >
          <TabNav />
          <Image />
        </chakra.aside>
        <chakra.main p="1.5rem 2rem">
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
            <Route
              path="/games/favorites"
              element={<Favorites title="Favorites" />}
            />

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
