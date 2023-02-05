// *Design Imports*
import { Flex, Heading, Divider } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";

const Header = (props) => {
  const { colorMode } = useColorMode();

  return (
    <Flex mb="4" mt={props.mt} justifyContent="center">
      <Heading fontSize="28px" textAlign="center">
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
