// *Design Imports*
import {
  useColorMode,
  useColorModeValue,
  useToast,
  IconButton,
  HStack,
  Divider,
  Text,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { BsLightbulbFill, BsLightbulbOffFill } from "react-icons/bs";

// *Custom Hooks Import*
import useCache from "../../hooks/useCache";

const Settings = () => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const { cache, setCache } = useCache();

  return (
    <>
      <HStack justify="space-between" paddingInline="1rem">
        <Text whiteSpace="nowrap">Light/Dark Mode:</Text>
        <IconButton
          icon={<SwitchIcon />}
          onClick={() => toggleColorMode()}
          size="md"
          fontSize="lg"
          variant="ghost"
          color="current"
          marginLeft="2"
        />
      </HStack>
      <Divider justifySelf="center" m="0.6rem auto" w="90%" />
      <HStack justify="space-between" paddingInline="1rem">
        <Text whiteSpace="nowrap">Enable Tips:</Text>
        <IconButton
          size="md"
          fontSize="lg"
          variant="ghost"
          color="current"
          marginLeft="2"
          onClick={() => {
            if (localStorage.getItem("tipsDisabled")) {
              setCache({ ...cache, tipsEnabled: true });
              localStorage.removeItem("tipsDisabled");
              toast({
                description: "Tips enabled.",
                status: "info",
                duration: 9000,
                isClosable: true,
                position: "top",
                variant: "solid",
              });
            } else {
              setCache({ ...cache, tipsEnabled: false });
              localStorage.setItem("tipsDisabled", true);
              toast({
                description: "Tips disabled.",
                status: "info",
                duration: 9000,
                isClosable: true,
                position: "top",
                variant: "solid",
              });
            }
          }}
          icon={
            cache.tipsEnabled || !localStorage.getItem("tipsDisabled") ? (
              <BsLightbulbFill />
            ) : (
              <BsLightbulbOffFill />
            )
          }
        />
      </HStack>
    </>
  );
};

export default Settings;
