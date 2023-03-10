import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const linkStyles = defineStyleConfig({
  baseStyle: {
    transition: "0.3s ease",
    _hover: {
      textDecoration: "none",
    },
  },
  variants: {
    navigation: (props) => ({
      borderBottom: "1px",
      borderColor: "transparent",
      lineHeight: "18px",
      opacity: "0.5",
      fontWeight: "500",
      _hover: {
        opacity: "1",
        borderColor: mode("bMain", "dwordMain")(props),
      },
      _groupHover: {
        opacity: "1",
        borderColor: mode("bMain", "dwordMain")(props),
      },
    }),
    navOnLocation: (props) => ({
      opacity: "1",
      fontWeight: "500",
      color: mode("g500", "p400")(props),
      borderBottom: "1px",
      borderColor: mode("g500", "p400")(props),
      lineHeight: "18px",
    }),

    simple: (props) => ({
      position: "relative",
      opacity: "0.75",
      _hover: {
        opacity: "1",
        textDecoration: "underline",
        textDecorationColor: mode("r500", "p500")(props),
      },
      _active: {
        top: "1.5px",
      },
    }),
  },
});
