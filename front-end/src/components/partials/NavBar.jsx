import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import {
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  // BreadcrumbLink,
  Link,
  chakra,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { MdChevronRight } from "react-icons/md";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();

  return (
    <HStack justifyContent="flex-end">
      <Breadcrumb
        spacing="8px"
        separator={
          <MdChevronRight
            color={colorMode === "dark" ? "#FFBB00" : "#E35855"}
            fontSize="2rem"
          />
        }
        mr="2rem"
      >
        <BreadcrumbItem>
          <Link
            as={NavLink}
            to="/games"
            variant={
              location.pathname === "/games" ? "navOnLocation" : "navigation"
            }
          >
            Games
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem>
          {/* TODO: Modal */}
          <Link as={NavLink} variant="navigation">
            Quests
          </Link>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <Link as={NavLink} variant="navigation">
            Cash In
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <chakra.h1 fontFamily="heading" fontSize="2rem" color="r500">
        Quest{" "}
        <chakra.span
          fontFamily="roboto"
          fontSize="1.4rem"
          fontWeight="700"
          fontStyle="italic"
          color="p500"
        >
          Casino
        </chakra.span>
      </chakra.h1>
    </HStack>
  );
};

export default NavBar;
