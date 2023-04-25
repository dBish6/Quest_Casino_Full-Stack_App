import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import { HStack, Box, Link, Icon } from "@chakra-ui/react";
import {
  MdOutlineHome,
  MdOutlineAccountCircle,
  MdInfoOutline,
  MdSupportAgent,
} from "react-icons/md";
import { GiPerspectiveDiceSixFacesThree, GiChest } from "react-icons/gi";

const Nav = (props) => {
  const location = useLocation();

  return (
    <Box display="flex" flexDir="column" rowGap="0.5rem">
      <HStack data-group>
        <Icon
          as={MdOutlineHome}
          variant={
            location.pathname === "/home" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          as={NavLink}
          to="/home"
          variant={
            location.pathname === "/home" ? "navOnLocation" : "navigation"
          }
        >
          Home
        </Link>
      </HStack>
      <HStack data-group>
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
      <HStack data-group>
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
      <HStack data-group>
        <Icon
          as={GiChest}
          variant={props.show.quests ? "navOnLocation" : "navigation"}
        />
        <Link
          onClick={() => props.setShow({ ...props.show, quests: true })}
          variant={props.show.quests ? "navOnLocation" : "navigation"}
        >
          Quests
        </Link>
      </HStack>
      <HStack data-group>
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
      <HStack data-group>
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
