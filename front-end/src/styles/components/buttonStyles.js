import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const buttonStyles = defineStyleConfig({
  // Styles for the base style
  baseStyle: {},
  // Styles for the size variations
  sizes: {},
  // Styles for the visual style variations
  variants: {
    primary: (props) => ({
      bgColor: mode("bl200", "bd400")(props),
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
      color: mode("bMain", "dwordMain"),
      borderWidth: "1px",
      borderColor: mode(
        "rgba(54, 54, 54, 0.2)",
        "rgba(244, 244, 244, 0.2)"
      )(props),
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
  },
  // The default `size` or `variant` values
  defaultProps: {},
});
