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
  const [isSmallerThan323] = useMediaQuery("(max-width: 323px)");

  return (
    <>
      <HStack as="header" justifyContent="flex-end">
        {currentUser !== null && (
          <>
            <GetBalance fontSize={isSmallerThan323 ? "16px" : "18px"} />
            <Divider
              orientation="vertical"
              bgColor={colorMode === "dark" ? "wMain" : "bMain"}
              opacity="0.2"
              w={colorMode === "dark" ? "0.5px" : "1px"}
              h="2rem"
              marginInline={
                isSmallerThan323 ? "0.5rem !important" : "1rem !important"
              }
            />
          </>
        )}
        {isLargerThan622 && (
          <Breadcrumb
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
                as={NavLink}
                to="/games"
                variant={
                  location.pathname === "/games"
                    ? "navOnLocation"
                    : "navigation"
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
        )}

        <Link as={NavLink} to="/home">
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
        </Link>
      </HStack>

      <CashInModal show={show} setShow={setShow} />
      <QuestsModal show={show} setShow={setShow} />
    </>
  );
};

export default NavBar;
