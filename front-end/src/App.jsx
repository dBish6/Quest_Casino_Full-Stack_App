import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  // Navigate,
  Outlet,
} from "react-router-dom";
import { Grid } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";

import PrivateRoute from "./features/authentication/PrivateRoute";

// *Context Import*
import { AuthProvider } from "./features/authentication/contexts/AuthContext";

// *Design Imports*
import { chakra, Image } from "@chakra-ui/react";

// *Component Imports*
import TabNav from "./components/sideBar";
import NavBar from "./components/partials/NavBar";

// *Feature Imports*
import RegisterModel from "./features/authentication/components/RegisterModel";
import PasswordResetModel from "./features/authentication/components/PasswordResetModel";

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
  const { colorMode } = useColorMode();
  return (
    <>
      {/* Nested routes render out here. */}
      <Grid templateColumns="235px 1fr">
        <chakra.aside
          bgColor={colorMode === "dark" ? "#424B5E" : "#CCD1DA"}
          minH="100vh"
        >
          <TabNav />
          <Image />
        </chakra.aside>
        <chakra.main
          // display="grid"
          // gridTemplateColumns="repeat(12, 1fr)"
          // gridTemplateRows="32px 1fr"
          // gap="4"
          p="1.5rem 2rem"
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
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ShowPartials />}>
            <Route path="/" element={<Home title="Home" />} />
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
            <Route path="*" element={<Error404 title="ERROR" />} />
            {/* <Route path="*" render={() => <Navigate to="/error404" />} /> */}

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
    </BrowserRouter>
  );
}

export default App;
