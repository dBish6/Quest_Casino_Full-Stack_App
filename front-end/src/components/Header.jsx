// *Design Imports*
import { Flex, Heading, Divider, useColorMode } from "@chakra-ui/react";

const Header = (props) => {
  const { colorMode } = useColorMode();

  // TODO: Change name.
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
          mt="2px"
          h={colorMode === "dark" ? "1px" : "2px"}
          w="70%"
          bgColor={colorMode === "dark" ? "wMain" : "bMain"}
          opacity="0.2"
          position="relative"
          left="15%"
        />
      </Heading>
    </Flex>
  );
};

export default Header;
