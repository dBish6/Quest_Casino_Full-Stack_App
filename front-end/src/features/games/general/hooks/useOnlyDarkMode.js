import { useEffect } from "react";
import { useColorMode } from "@chakra-ui/color-mode";

const useOnlyDarkMode = () => {
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") {
      localStorage.setItem("previousColorMode", colorMode);
      setColorMode("dark");
      localStorage.setItem("chakra-ui-color-mode", "dark");
    }

    return () => {
      const previousColorMode = localStorage.getItem("previousColorMode");
      if (previousColorMode) {
        setColorMode(previousColorMode);
        localStorage.setItem("chakra-ui-color-mode", "light");
        localStorage.removeItem("previousColorMode");
      }
    };
  }, []);
};

export default useOnlyDarkMode;
