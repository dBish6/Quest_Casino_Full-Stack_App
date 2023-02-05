import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import { HStack, Box, Link, Icon } from "@chakra-ui/react";
import {
  MdOutlineHome,
  MdOutlineAccountCircle,
  // MdSearch,
  MdOutlineFavoriteBorder,
  MdInfoOutline,
  MdSupportAgent,
} from "react-icons/md";
import { GiPerspectiveDiceSixFacesThree } from "react-icons/gi";

const Nav = () => {
  const location = useLocation();

  return (
    <Box display="flex" flexDir="column" gap="0.5rem">
      <HStack gap="2" data-group>
        <Icon
          as={MdOutlineHome}
          variant={
            location.pathname === "/" || location.pathname === "/home"
              ? "navOnLocation"
              : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/home"
          variant={
            location.pathname === "/" || location.pathname === "/home"
              ? "navOnLocation"
              : "navigation"
          }
        >
          Home
        </Link>
      </HStack>
      <HStack gap="2" data-group>
        <Icon
          as={GiPerspectiveDiceSixFacesThree}
          variant={
            location.pathname === "/games" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/games"
          variant={
            location.pathname === "/games" ? "navOnLocation" : "navigation"
          }
        >
          Games
        </Link>
      </HStack>
      <HStack gap="2" data-group>
        <Icon
          as={MdOutlineAccountCircle}
          variant={
            location.pathname === "/user/profile"
              ? "navOnLocation"
              : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/user/profile"
          variant={
            location.pathname === "/user/profile"
              ? "navOnLocation"
              : "navigation"
          }
        >
          Profile
        </Link>
      </HStack>
      {/* <HStack gap="2" data-group>
        <Icon as={MdSearch} />
        <Link as={NavLink}>Search</Link>
      </HStack> */}
      <HStack gap="2" data-group>
        <Icon
          as={MdOutlineFavoriteBorder}
          variant={
            location.pathname === "/games/favorites"
              ? "navOnLocation"
              : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/games/favorites"
          variant={
            location.pathname === "/games/favorites"
              ? "navOnLocation"
              : "navigation"
          }
        >
          Favorites
        </Link>
      </HStack>
      <HStack gap="2" data-group>
        <Icon
          as={MdInfoOutline}
          variant={
            location.pathname === "/about" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/about"
          variant={
            location.pathname === "/about" ? "navOnLocation" : "navigation"
          }
        >
          About Us
        </Link>
      </HStack>
      <HStack gap="2" data-group>
        <Icon
          as={MdSupportAgent}
          variant={
            location.pathname === "/support" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/support"
          variant={
            location.pathname === "/support" ? "navOnLocation" : "navigation"
          }
        >
          Support
        </Link>
      </HStack>
    </Box>
  );
};

export default Nav;
