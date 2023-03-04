import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const iconStyles = defineStyleConfig({
  baseStyle: {
    transition: "0.3s ease",
  },
  variants: {
    primary: (props) => ({
      color: mode("bMain", "wMain")(props),
    }),

    navigation: (props) => ({
      color: mode("bMain", "wMain")(props),
      fontSize: "28px",
      opacity: "0.5",
      _groupHover: {
        opacity: "1",
      },
    }),
    navOnLocation: (props) => ({
      color: mode("g500", "p400")(props),
      fontSize: "28px",
      opacity: "1",
    }),
  },
});
