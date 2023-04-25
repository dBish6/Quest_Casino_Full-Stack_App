import { useRef, useEffect } from "react";

// *Design Imports*
import {
  Flex,
  Box,
  Text,
  Link,
  ButtonGroup,
  Button,
  chakra,
  useColorMode,
} from "@chakra-ui/react";

// *Custom Hooks Imports*
import useDisableScroll from "../../hooks/useDisableScroll";

// *Component Imports*
import ModalTemplate from "./ModalTemplate";
import MyHeading from "../MyHeading";

const ConfirmAgeModal = (props) => {
  useDisableScroll(props.showConfirmAge, 510);
  const { colorMode } = useColorMode();
  const waitForModalRef = useRef(null);

  useEffect(() => {
    let modalDuration;
    modalDuration = setTimeout(() => {
      waitForModalRef.current = true;
    }, 250);

    return () => {
      clearTimeout(modalDuration);
    };
  }, []);

  return (
    <>
      {waitForModalRef.current && (
        <Flex justify="center" align="center" h="100vh">
          <Box>
            <Text textAlign="center" maxW="325px" mb="0.5rem" opacity="0.9">
              Just refresh the page and try again. Quest Casino is all just for
              fun{" "}
              <chakra.span color={colorMode === "dark" ? "p400" : "r500"}>
                :)
              </chakra.span>
            </Text>
            <Flex justify="center">
              <Link
                onClick={() => window.location.reload()}
                variant="simple"
                fontWeight="500"
                opacity="1"
              >
                Refresh
              </Link>
            </Flex>
          </Box>
        </Flex>
      )}
      <ModalTemplate
        show={props.showConfirmAge}
        confirmAge={true}
        animation={{ type: "up", y: "200%" }}
        maxW="325px"
      >
        <Button
          isDisabled={props.loading}
          onClick={() => props.setShowConfirmAge(false)}
          variant="exit"
          position="absolute"
          top="-8px"
          right="-8px"
        >
          &#10005;
        </Button>
        <MyHeading fontSize="32px" mb="0.5rem" text="Confirm Age" />
        <Text textAlign="center" mb="1.5rem">
          To proceed you must be at least{" "}
          <chakra.span
            fontSize="17px"
            fontWeight="600"
            color={colorMode === "dark" ? "p400" : "r500"}
          >
            19
          </chakra.span>{" "}
          years of age.
        </Text>

        <ButtonGroup display="flex">
          <Button
            onClick={() => {
              localStorage.setItem("ageConfirmed", true);
              window.location.reload();
            }}
            variant="primary"
            w="100%"
          >
            Yes
          </Button>
          <Button
            onClick={() => props.setShowConfirmAge(false)}
            variant="secondary"
            w="100%"
          >
            No
          </Button>
        </ButtonGroup>
      </ModalTemplate>
    </>
  );
};

export default ConfirmAgeModal;
