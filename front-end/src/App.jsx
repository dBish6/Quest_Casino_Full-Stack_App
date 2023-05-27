/* Quest Casino

   Author: David Bishop
   Creation Date: February 4, 2023
*/

import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Box, useMediaQuery } from "@chakra-ui/react";

import PrivateRoute from "./features/authentication/PrivateRoute";

// *Context Imports*
import { AuthProvider } from "./features/authentication/contexts/AuthContext";
import { CacheProvider } from "./contexts/Cache";

// *Design Import*
import { chakra } from "@chakra-ui/react";

// *Component Imports*
import DesktopSidebar from "./components/sideBar";
import MobileSidebar from "./components/sideBar/mobile";
import NavBar from "./components/partials/NavBar";
import ConfirmAgeModal from "./components/modals/ConfirmAgeModal";

// *Pages/Views*
import Home from "./pages/Home";
import About from "./pages/About";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import GamesHome from "./pages/games/GamesHome";
import TopPlayers from "./pages/games/TopPlayers";
import Error404 from "./pages/errors/Error404";
import Error401 from "./pages/errors/Error401";
import Error429 from "./pages/errors/Error429";
import Error500 from "./pages/errors/Error500";

import DomLoader from "./components/DomLoader";

// *Game Import*
const Blackjack = lazy(() => import("./pages/games/Blackjack"));

const ShowPartials = (props) => {
  const location = useLocation();

  useEffect(() => {
    location.pathname !== "/user/profile"
      ? (document.body.style.overflowX = "hidden")
      : (document.body.style.overflowX = "unset");
  }, [location]);

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={props.isLargerThan1280 ? "235px 1fr" : "1fr"}
      >
        {props.isLargerThan1280 ? (
          <>
            <Box />
            <DesktopSidebar />
          </>
        ) : (
          <MobileSidebar />
        )}

        <chakra.main
          p={{ base: "1.5rem 1rem", md: "1.5rem 2rem", xl: "1.5rem 2rem" }}
          minH="100vh"
        >
          <NavBar />
          <Outlet />
        </chakra.main>
        {/* <Footer /> */}
      </Box>
    </>
  );
};

function App() {
  const [showConfirmAge, setShowConfirmAge] = useState(false);
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  const isAgeConfirmed = localStorage.getItem("ageConfirmed");
  useEffect(() => {
    !isAgeConfirmed && setShowConfirmAge(true);
  }, [isAgeConfirmed]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CacheProvider>
          {isAgeConfirmed ? (
            <Suspense fallback={<DomLoader />}>
              <Routes>
                <Route
                  element={<ShowPartials isLargerThan1280={isLargerThan1280} />}
                >
                  <Route path="/" element={<Navigate to="/home" />} />
                  <Route path="/home" element={<Home title="Home" />} />
                  <Route path="/about" element={<About title="About Us" />} />
                  <Route
                    path="/support"
                    element={<Support title="Support" />}
                  />
                  <Route
                    path="/user/profile"
                    element={
                      <PrivateRoute>
                        <Profile
                          title="Profile"
                          isLargerThan1280={isLargerThan1280}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/games" element={<GamesHome title="Games" />} />
                  <Route
                    path="/games/leaderboard"
                    element={
                      <PrivateRoute>
                        <TopPlayers title="Leaderboard" />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/error404"
                    element={<Error404 title="ERROR" />}
                  />
                  <Route
                    path="/error401"
                    element={<Error401 title="ERROR" />}
                  />
                  <Route
                    path="/error429"
                    element={<Error429 title="ERROR" />}
                  />
                  <Route
                    path="/error500"
                    element={<Error500 title="ERROR" />}
                  />
                  <Route path="*" element={<Navigate to="/error404" />} />
                </Route>

                <Route
                  path="/games/blackjack"
                  element={
                    <PrivateRoute>
                      <Blackjack title="Blackjack" />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          ) : (
            <ConfirmAgeModal
              showConfirmAge={showConfirmAge}
              setShowConfirmAge={setShowConfirmAge}
            />
          )}
        </CacheProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
