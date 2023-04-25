import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const selectStyles = defineStyleConfig({
  variants: {
    primary: (props) => ({
      field: {
        bgColor: "transparent",
        borderWidth: "1px",
        borderColor: mode("borderL", "borderD")(props),
        _hover: {
          boxShadow: "lg",
        },
        _focus: {
          borderColor: mode("bMain", "p500")(props),
          boxShadow: "lg",
        },
        transition: "0.38s ease",
      },
    }),
  },
});
