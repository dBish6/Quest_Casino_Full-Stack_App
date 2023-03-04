import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// *Design Imports*
import {
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  Link,
  chakra,
  Box,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MdChevronRight } from "react-icons/md";

// *Custom Hooks Import*
import useAuth from "../../hooks/useAuth";

// *API Services Imports*
import GetUserWinsBalance from "../../features/authentication/api_services/GetUserWinsBalance";

// *Component Imports*
import CashInModal from "../../features/authentication/components/modals/CashInModal";
import QuestsModal from "../../features/quests/components/modals/QuestsModal";

const NavBar = () => {
  const [show, setShow] = useState({ quests: false, cashIn: false });
  const { colorMode } = useColorMode();
  const location = useLocation();

  const { currentUser } = useAuth();
  // const { fsUserData, notFoundErr, loading } = GetUserWinsBalance(
  //   currentUser.uid
  // );

  // console.log(notFoundErr);
  return (
    <>
      <HStack justifyContent="flex-end">
        {/* {currentUser !== null && loading ? (
          <Box>
            <Text>Loading...</Text>
          </Box>
        ) : (
          <Box backgroundColor="g300" p="6px" borderRadius="6px">
            <Text>${fsUserData.balance}</Text>
          </Box>
        )} */}
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
            <Link
              as={NavLink}
              variant={show.quests ? "navOnLocation" : "navigation"}
              onClick={() => setShow({ quests: true })}
            >
              Quests
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link
              as={NavLink}
              variant={show.cashIn ? "navOnLocation" : "navigation"}
              onClick={() => setShow({ cashIn: true })}
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

      <CashInModal show={show.cashIn} setShow={setShow} />
      <QuestsModal show={show.quests} setShow={setShow} />
    </>
  );
};

export default NavBar;
