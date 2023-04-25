// *Design Imports*
import { Flex, Heading, Divider, useColorMode } from "@chakra-ui/react";

const MyHeading = (props) => {
  const { colorMode } = useColorMode();

  return (
    <Flex justifyContent="center">
      <Heading
        fontSize={props.fontSize}
        lineHeight="1.2"
        textAlign="center"
        {...props}
      >
        {props.text}
        <Divider
          border={colorMode === "dark" ? "1px solid wMain" : "1px solid bMain"}
          mt="2px"
          w="70%"
          position="relative"
          left="15%"
        />
      </Heading>
    </Flex>
  );
};

export default MyHeading;
