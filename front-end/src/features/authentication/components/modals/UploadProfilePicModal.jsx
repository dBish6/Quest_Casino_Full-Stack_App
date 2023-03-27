import { useEffect } from "react";

// *Design Imports*
import {
  Container,
  Input,
  chakra,
  Box,
  Button,
  Text,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Component Imports*
import ModalBackdrop from "../../../../components/modals/ModalBackdrop";
import Header from "../../../../components/Header";

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

const UploadProfilePicModal = (props) => {
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

          {props.loading && (
            <Spinner
              position="fixed"
              top="50%"
              left="49%"
              size="lg"
              color={colorMode === "dark" ? "p500" : "r500"}
              zIndex="1500"
            />
          )}
          <Box opacity={props.loading ? "0.9" : "1"} transition="0.38s ease">
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
              p="1.5rem 1.5rem 1rem 1.5rem"
              maxW="325px"
              backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
              borderWidth="1px"
              borderColor={colorMode === "dark" ? "borderD" : "borderL"}
              borderRadius="6px"
            >
              <Button
                isDisabled={props.loading}
                onClick={() => props.setShow({ uploadPicture: false })}
                variant="exit"
                position="absolute"
                top="-8px"
                right="-8px"
              >
                &#10005;
              </Button>
              <Header fontSize="32px" mb="1.5rem" text="Upload Image" />

              <Box
                borderWidth="1px"
                borderColor={colorMode === "dark" ? "borderD" : "borderL"}
                borderRadius="6px"
                p="0.5rem 0"
              >
                <Input
                  type="file"
                  accept="/image/*"
                  isDisabled={props.loading}
                  onChange={(file) =>
                    props.handleProfilePicture(
                      props.userId,
                      file,
                      props.setSelectedPicture,
                      true
                    )
                  }
                  variant="unstyled"
                  p="0 0.5rem"
                  _hover={{ boxShadow: "none" }}
                />
              </Box>
              <Text as="small" textAlign="center" mt="0.5rem">
                <chakra.span fontSize="14px">Formats:</chakra.span> jpg or png.
              </Text>
            </Container>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadProfilePicModal;
