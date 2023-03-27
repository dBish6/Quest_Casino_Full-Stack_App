// *Design Imports*
import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";

// *Animations*
const backdrop = {
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      type: "ease",
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 1,
      type: "ease",
    },
  },
};

const ModalBackdrop = (props) => {
  return (
    <chakra.div
      as={motion.div}
      variants={backdrop}
      animate="visible"
      initial="hidden"
      exit="hidden"
      key="backdrop"
      onClick={() => {
        if (props.type === "gameStart") {
          return;
        } else {
          props.setShow(false);
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
      pointerEvents={props.loading && "none"}
    />
  );
};

export default ModalBackdrop;
