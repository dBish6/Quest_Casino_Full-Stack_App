// *Design Imports*
import { useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const Settings = () => {
  const { toggleColorMode } = useColorMode();
  // const currentMode = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <>
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={() => toggleColorMode()}
        icon={<SwitchIcon />}
      />
    </>
  );
};

export default Settings;
