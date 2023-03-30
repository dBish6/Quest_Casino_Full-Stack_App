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
  Text,
  useColorMode,
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

  return (
    <>
      <HStack as="header" justifyContent="flex-end">
        {currentUser !== null && (
          <>
            <Text
              fontSize="18px"
              //  backgroundColor="g300" p="6px" borderRadius="6px"
            >
              <GetBalance currentUser={currentUser} />
            </Text>
            <Divider orientation="vertical" h="2rem" ml="1rem !important" />
          </>
        )}
        <Breadcrumb
          spacing="8px"
          separator={
            <MdChevronRight
              color={colorMode === "dark" ? "#FFBB00" : "#E35855"}
              fontSize="2rem"
            />
          }
          marginInline="1rem 2rem !important"
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
            <Link
              as={NavLink}
              variant={show.quests ? "navOnLocation" : "navigation"}
              onClick={() => setShow({ ...show, quests: true })}
            >
              Quests
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link
              as={NavLink}
              variant={show.cashIn ? "navOnLocation" : "navigation"}
              onClick={() => setShow({ ...show, cashIn: true })}
            >
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

      <CashInModal show={show} setShow={setShow} />
      <QuestsModal show={show} setShow={setShow} />
    </>
  );
};

export default NavBar;
