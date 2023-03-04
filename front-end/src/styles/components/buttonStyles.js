import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const buttonStyles = defineStyleConfig({
  variants: {
    primary: (props) => ({
      bgColor: mode("bl200", "bd400")(props), // TODO: Play around with light theme button.
      color: mode("bMain", "dwordMain")(props),
      boxShadow: "md",
      _hover: {
        bgColor: mode("wMain", "bd300")(props),
        color: mode("#000000", "wMain")(props),
        boxShadow: "lg",
      },
      _active: {
        bgColor: mode("g300", "g500")(props),
      },
      transition: "0.38s ease",
    }),

    secondary: (props) => ({
      bgColor: "transparent",
      color: mode("bMain", "dwordMain")(props),
      borderWidth: "1px",
      borderColor: mode("borderL", "borderD")(props),
      boxShadow: "md",
      _hover: {
        bgColor: mode("bl200", "bd400")(props),
        color: mode("#000000", "wMain")(props),
        boxShadow: "lg",
      },
      _active: {
        bgColor: mode("g300", "g500")(props),
      },
      transition: "0.38s ease",
    }),

    exit: {
      bgColor: "r500",
      color: "dwordMain",
      _hover: {
        bgColor: "r600",
        boxShadow: "lg",
      },
      _active: {
        opacity: 0.6,
      },
      transition: "0.38s ease",
    },

    transparency: (props) => ({
      bgColor: "transparent",
      color: mode("bMain", "dwordMain")(props),
      opacity: "0.7",
      _hover: {
        opacity: "0.85",
        color: mode("#000000", "wMain")(props),
      },
      _active: {
        opacity: "1",
        // bgColor: mode("g300", "g500")(props),
      },
      transition: "0.38s ease",
    }),
  },
});
