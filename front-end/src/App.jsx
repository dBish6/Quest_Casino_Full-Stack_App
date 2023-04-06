/* Quest Casino

   Author: David Bishop
   Creation Date: February 4, 2023
*/

import { useState, useEffect, lazy, Suspense } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { Grid, Box, Flex, useMediaQuery } from "@chakra-ui/react";

import PrivateRoute from "./features/authentication/PrivateRoute";

// *Context Import*
import { AuthProvider } from "./features/authentication/contexts/AuthContext";

// *Design Imports*
import { chakra, useColorMode } from "@chakra-ui/react";

// *Component Imports*
import DesktopSidebar from "./components/sideBar";
import MobileSidebar from "./components/sideBar/mobile";
import NavBar from "./components/partials/NavBar";

// *Feature Imports*
import RegisterModal from "./features/authentication/components/modals/RegisterModal";

// *Pages/Views*
import Home from "./pages/Home";
import About from "./pages/About";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import GamesHome from "./pages/games/GamesHome";
// import Blackjack from "./pages/games/Blackjack";
import Error404 from "./pages/errors/Error404";
import Error500 from "./pages/errors/Error500";

import DomLoader from "./components/DomLoader";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_GAME } from "./features/games/blackjack/redux/blackjackSlice";
import { selectGameType } from "./features/games/blackjack/redux/blackjackSelectors";

// *Game Import*
const Blackjack = lazy(() => import("./pages/games/Blackjack"));

const ShowPartials = (props) => {
  const [showSideBar, setShowSideBar] = useState(true);
  const { colorMode } = useColorMode();

  return (
    <>
      {/* Nested routes render out here. */}
      <Box
        display="grid"
        gridTemplateColumns={props.isLargerThan1280 ? "235px 1fr" : "1fr"}
      >
        {props.isLargerThan1280 ? (
          <>
            <Box />
            <chakra.aside
              position="fixed"
              bgColor={colorMode === "dark" ? "bd700" : "bl400"}
              w="235px"
              minH="100vh"
              // borderRight={
              //   colorMode === "dark"
              //     ? "1px solid borderD"
              //     : "1px solid borderL"
              // }
            >
              <DesktopSidebar />
            </chakra.aside>
          </>
        ) : (
          <MobileSidebar
            showSideBar={showSideBar}
            setShowSideBar={setShowSideBar}
          />
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

const ClearGamesWhileNotOnPage = ({ children }) => {
  const location = useLocation();
  const gameType = useSelector(selectGameType);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(document.location.pathname);
    if (location.pathname !== "/games/blackjack" && gameType) {
      dispatch(CLEAR_GAME());
    }
  }, [location]);
};

function App() {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  // const location = useLocation();

  // const gameType = useSelector(selectGameType);
  // const dispatch = useDispatch();

  // Ensures no game is running if the player leaves the page.
  // useEffect(() => {
  //   console.log(document.location.pathname);
  //   if (document.location.pathname !== "/games/blackjack" && gameType) {
  //     dispatch(CLEAR_GAME());
  //   }
  // }, [gameType, dispatch]);

  return (
    <HashRouter>
      <AuthProvider>
        <Suspense fallback={<DomLoader />}>
          <Routes>
            {/* <Route element={<ClearGamesWhileNotOnPage />}> */}
            <Route
              element={<ShowPartials isLargerThan1280={isLargerThan1280} />}
            >
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home title="Home" />} />
              <Route path="/about" element={<About title="About Us" />} />
              <Route path="/support" element={<Support title="Support" />} />
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

              <Route path="/error404" element={<Error404 title="ERROR" />} />
              <Route path="/error500" element={<Error500 title="ERROR" />} />
              <Route path="*" element={<Navigate to="/error404" />} />

              <Route path="/register" element={<RegisterModal />} />
            </Route>

            <Route path="/loading" element={<DomLoader title="Loader" />} />

            <Route
              path="/games/blackjack"
              element={
                <PrivateRoute>
                  <Blackjack title="Blackjack" />
                </PrivateRoute>
              }
            />
            {/* </Route> */}
          </Routes>
        </Suspense>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
