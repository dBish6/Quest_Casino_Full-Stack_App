import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const cardStyles = defineStyleConfig({
  variants: {
    // TODO:
    primary: (props) => ({
      container: {
        bg: "transparent",
        // bg: mode("bl300", "bd500")(props),
        // boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)",
        boxShadow: "base",
        // bgGradient: mode(
        //   "fadeL",
        //   "linear-gradient(180deg, #616D86 0%, rgba(97, 109, 134, 0) 100%)"
        // )(props),
        // borderTopRadius: "1rem 1rem",
        // borderBottomRadius: "0px 0px",
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
        // alignSelf: "center",
        p: "0",
        pt: "0.5rem",
      },
    }),
  },
});
