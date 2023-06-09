/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";
import { Box, Container, Button, useColorMode } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import ModalAnimations from "../../utils/animations/modalAnimations";
import useKeyboardHelper from "../../hooks/useKeyboardHelper";

const ModalTemplate = (props) => {
  const {
    show,
    setShow,
    animation,
    objName,
    game,
    confirmAge,
    loading,
    children,
    ...rest
  } = props;

  const modalRef = useRef(null);
  const { colorMode } = useColorMode();
  const { modelBackdrop, modelFadeDown, modelFadeUp } =
    ModalAnimations(animation);
  const {
    handleKeyEscape,
    initializeKeyboardOnModal,
    handleModalKeyboardLock,
  } = useKeyboardHelper();

  useEffect(() => {
    if (show) {
      const modalElement = modalRef.current;

      const { firstFocusableElement, lastFocusableElement } =
          initializeKeyboardOnModal(modalRef),
        keyboardListenerWrapper = (event) => {
          handleKeyEscape(event, { type: "modal", setShow, objKey: objName });
          handleModalKeyboardLock(event, {
            firstFocusableElement,
            lastFocusableElement,
          });
        };

      modalElement.addEventListener("keydown", keyboardListenerWrapper);
      return () => {
        modalElement.removeEventListener("keydown", keyboardListenerWrapper);
      };
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* *Backdrop* */}
          <Box
            aria-label="Backdrop"
            as={motion.div}
            variants={modelBackdrop}
            animate={modelBackdrop.visible}
            initial={modelBackdrop.hidden}
            exit={modelBackdrop.hidden}
            key="backdrop"
            onClick={() => {
              if (game === "blackjack" || confirmAge) {
                return;
              } else {
                objName
                  ? setShow((prev) => ({
                      ...prev,
                      [objName]: false,
                    }))
                  : setShow(false);
              }
            }}
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="100vw"
            minH="100vh"
            backgroundColor="rgb(0, 0, 0, 0.4)"
            backdropBlur="2px"
            zIndex="overlay"
            pointerEvents={loading && "none"}
          />

          {/* *Modal* */}
          <Container
            tabIndex="-1"
            aria-label="Modal"
            as={motion.div}
            ref={modalRef}
            id="modal"
            variants={animation.type === "down" ? modelFadeDown : modelFadeUp}
            animate={
              animation.type === "down"
                ? modelFadeDown.visible
                : modelFadeUp.visible
            }
            initial={
              animation.type === "down"
                ? modelFadeDown.hidden
                : modelFadeUp.hidden
            }
            exit={
              animation.type === "down"
                ? modelFadeDown.hidden
                : modelFadeUp.exit
            }
            key="modal"
            zIndex="modal"
            position="fixed"
            top="50%"
            left="50%"
            p="1.5rem"
            backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
            {...rest}
          >
            <Button
              aria-label="Exit"
              isDisabled={loading}
              aria-disabled={loading}
              onClick={() =>
                objName
                  ? setShow((prev) => ({
                      ...prev,
                      [objName]: false,
                    }))
                  : setShow(false)
              }
              variant="exit"
              position="absolute"
              top="-8px"
              right="-8px"
            >
              &#10005;
            </Button>
            {children}
          </Container>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalTemplate;
