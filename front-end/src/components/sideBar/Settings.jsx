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
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const { cache, setCache } = useCache();

  return (
    <>
      <HStack justify="space-between" paddingInline="1rem">
        <Text aria-label="Light or Dark Mode" whiteSpace="nowrap">
          Light/Dark Mode:
        </Text>
        <IconButton
          aria-label={colorMode === "dark" ? "Moon" : "Sun"}
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
        <Text aria-label="Enable tip Popups" whiteSpace="nowrap">
          Enable Tips:
        </Text>
        <IconButton
          aria-label="Lightbulb"
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
