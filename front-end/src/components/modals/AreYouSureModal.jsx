import { useEffect } from "react";

// *Design Imports*
import { Container, HStack, Button, useColorMode } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Component Imports*
import ModalBackdrop from "./ModalBackdrop";
import Header from "../Header";

// *Animations*
const model = {
  visible: {
    scale: 1.0,
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 70 },
    },
  },
  hidden: {
    scale: 1.0,
    x: "-50%",
    opacity: 0,
  },
  exit: {
    scale: 0.8,
    x: "-50%",
    opacity: 0,
    transition: {
      duration: 0.5,
      type: "tween",
    },
  },
};

const AreYouSureModal = (props) => {
  console.log(props);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 510);
    }
  }, [props.show]);

  return (
    <AnimatePresence>
      {props.show && (
        <>
          <ModalBackdrop
            show={props.show}
            setShow={props.setShow}
            loading={props.loading}
          />
          <Container
            as={motion.div}
            variants={model}
            animate="visible"
            initial="hidden"
            exit="exit"
            zIndex="modal"
            display="grid"
            position="fixed"
            top="50%"
            left="50%"
            p="1.5rem"
            maxW="325px"
            backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
          >
            <Button
              isDisabled={props.loading}
              onClick={() => props.setShow(false)}
              variant="exit"
              position="absolute"
              top="-8px"
              right="-8px"
            >
              &#10005;
            </Button>
            <Header fontSize="32px" mb="1.5rem" text="Are you Sure?" />

            <HStack>
              <Button
                isLoading={props.loading ? true : false}
                onClick={() => {
                  if (props.handleProfilePicture) {
                    props.handleProfilePicture(
                      props.userId,
                      props.profilePic,
                      props.setSelectedPicture
                    );
                  }
                }}
                type="submit"
                variant="primary"
                w="100%"
              >
                Yes
              </Button>
              <Button
                isDisabled={props.loading}
                onClick={() => props.setShow(false)}
                variant="secondary"
                w="100%"
              >
                Cancel
              </Button>
            </HStack>
          </Container>
        </>
      )}
    </AnimatePresence>
  );
};

export default AreYouSureModal;
