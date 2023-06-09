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
          aria-label="Home"
          as={MdOutlineHome}
          variant={
            location.pathname === "/home" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          aria-selected={location.pathname === "/home"}
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
          aria-label="Dice"
          as={GiPerspectiveDiceSixFacesThree}
          variant={
            location.pathname === "/games" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          aria-selected={location.pathname === "/games"}
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
          aria-label="User"
          as={MdOutlineAccountCircle}
          variant={
            location.pathname === "/user/profile"
              ? "navOnLocation"
              : "navigation"
          }
        />
        <Link
          aria-selected={location.pathname === "/user/profile"}
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
          aria-label="Chest"
          as={GiChest}
          variant={props.show.quests ? "navOnLocation" : "navigation"}
        />
        <Link
          aria-selected={props.show.quests}
          aria-controls="modal"
          as={NavLink}
          onClick={() => props.setShow({ ...props.show, quests: true })}
          variant={props.show.quests ? "navOnLocation" : "navigation"}
        >
          Quests
        </Link>
      </HStack>
      <HStack data-group>
        <Icon
          aria-label="Info"
          as={MdInfoOutline}
          variant={
            location.pathname === "/about" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          aria-selected={location.pathname === "/about"}
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
          aria-label="Support"
          as={MdSupportAgent}
          variant={
            location.pathname === "/support" ? "navOnLocation" : "navigation"
          }
        />
        <Link
          aria-selected={location.pathname === "/support"}
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
