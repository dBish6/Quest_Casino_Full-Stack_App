import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const cardStyles = defineStyleConfig({
  variants: {
    primary: (props) => ({
      container: {
        bg: "transparent",
        boxShadow: "base",
        borderRadius: "6px",
        p: "1rem",
        _hover: {
          bg: mode("bl200", "bd500")(props),
          boxShadow: "lg",
        },
        transition: "0.38s ease",
      },
      header: {
        alignSelf: "center",
        p: "0",
        pb: "0.5rem",
      },
      body: {
        p: "0.5rem 0 0.5rem 0",
      },
      footer: {
        p: "0",
        pt: "0.5rem",
      },
    }),
  },
});
