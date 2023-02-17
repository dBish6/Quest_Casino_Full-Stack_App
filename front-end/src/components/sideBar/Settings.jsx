// *Design Imports*
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const Settings = () => {
  const { toggleColorMode } = useColorMode();
  // const currentMode = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <HStack justifyContent="center">
      <Text>Light/Dark Mode:</Text>
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={() => toggleColorMode()}
        icon={<SwitchIcon />}
      />
    </HStack>
  );
};

export default Settings;
