import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import {
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  Link,
  chakra,
  Divider,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { MdChevronRight } from "react-icons/md";

// *Custom Hooks Import*
import useAuth from "../../hooks/useAuth";

// *Component Imports*
import GetBalance from "../GetBalance";
import CashInModal from "../../features/authentication/components/modals/CashInModal";
import QuestsModal from "../../features/quests/components/modals/QuestsModal";

const NavBar = () => {
  const [show, setShow] = useState({ quests: false, cashIn: false });
  const { colorMode } = useColorMode();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isLargerThan622] = useMediaQuery("(min-width: 622px)");

  return (
    <>
      <HStack
        role="banner"
        aria-label="Navigation Bar"
        as="header"
        justifyContent="flex-end"
      >
        {currentUser !== null && (
          <>
            <GetBalance fontSize="18px" />
            <Divider
              orientation="vertical"
              bgColor={colorMode === "dark" ? "wMain" : "bMain"}
              opacity="0.2"
              w={colorMode === "dark" ? "0.5px" : "1px"}
              h="2rem"
              marginInline={
                !isLargerThan622
                  ? "0.95rem 0.5rem !important"
                  : "1rem !important"
              }
            />
          </>
        )}
        <Breadcrumb
          display={isLargerThan622 ? "initial" : "none"}
          spacing="8px"
          separator={
            <MdChevronRight
              color={colorMode === "dark" ? "#FFBB00" : "#E35855"}
              fontSize="2rem"
            />
          }
          m="0 2rem 0 0 !important"
        >
          <BreadcrumbItem>
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
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link
              aria-selected={show.quests}
              aria-controls="modal"
              as={NavLink}
              variant={show.quests ? "navOnLocation" : "navigation"}
              onClick={() => setShow({ ...show, quests: true })}
            >
              Quests
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link
              aria-selected={show.cashIn}
              aria-controls="modal"
              as={NavLink}
              variant={show.cashIn ? "navOnLocation" : "navigation"}
              onClick={() => setShow({ ...show, cashIn: true })}
            >
              Cash In
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>

        <Link as={NavLink} to="/home">
          <chakra.h1
            fontFamily="heading"
            fontSize="2rem"
            color="r500"
            textShadow={colorMode === "light" && "1px 1px 0px #363636"}
          >
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
        </Link>
      </HStack>

      <CashInModal show={show} setShow={setShow} />
      <QuestsModal show={show} setShow={setShow} />
    </>
  );
};

export default NavBar;
