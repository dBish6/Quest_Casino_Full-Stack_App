// *Design Imports*
import { Box, Heading, useMediaQuery } from "@chakra-ui/react";
import { motion } from "framer-motion";

const DomLoader = () => {
  const [isSmallerThan500] = useMediaQuery("(max-width: 500px)");

  return (
    <Box
      display="flex"
      pos="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
    >
      <Heading
        as={motion.h2}
        animate={{
          y: ["0%", "100%"],
          transition: {
            duration: 0.75,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        fontSize={isSmallerThan500 ? "33px" : "38px"}
        lineHeight="1.2"
        textAlign="center"
        mr="6px"
      >
        Loading
      </Heading>
      <Heading
        as={motion.h2}
        animate={{
          y: ["100%", "0%"],
          transition: {
            duration: 0.75,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        color="wMain"
        fontSize={isSmallerThan500 ? "20px" : "25px"}
        fontFamily="roboto"
        fontStyle="italic"
        fontWeight="700"
        lineHeight="1.2"
        textAlign="center"
      >
        Configuration...
      </Heading>
    </Box>
  );
};

export default DomLoader;
