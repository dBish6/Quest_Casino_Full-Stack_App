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
      bgColor: "p700",
      color: "whiteTxt",
      boxShadow: "md",
      _hover: {
        bgColor: mode("p800", "p500")(props),
        boxShadow: "lg",
      },
      transition: "0.38s ease",
    }),
  },
  // The default `size` or `variant` values
  defaultProps: {},
});
