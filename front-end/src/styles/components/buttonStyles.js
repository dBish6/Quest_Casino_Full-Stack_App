import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const buttonStyles = defineStyleConfig({
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
      _focusVisible: {
        bgColor: mode("wMain", "bd300")(props),
        color: mode("#000000", "wMain")(props),
        borderWidth: "1px",
        borderColor: mode("bMain", "p500")(props),
        boxShadow: "lg",
      },
      _active: {
        bgColor: mode("g300", "g500")(props),
      },
      transition: "0.28s ease",
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
      _focusVisible: {
        bgColor: mode("bl200", "bd400")(props),
        color: mode("#000000", "wMain")(props),
        borderWidth: props.is_invalid === "true" && "1px", // is_invalid is from Davy Blackjack.
        borderColor: props.is_invalid === "true" && "p500",
        boxShadow: "lg",
      },
      _active: {
        bgColor: mode("g300", "g500")(props),
      },
      transition: "0.28s ease",
    }),
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
      },
      transition: "0.28s ease",
    }),

    exit: {
      bgColor: "r500",
      color: "dwordMain",
      _hover: {
        bgColor: "r600",
        color: "wMain",
        boxShadow: "lg",
      },
      _active: {
        bgColor: "r400",
      },
      transition: "0.28s ease",
    },

    chipRed: (props) => ({
      position: "relative",
      bgColor: mode("r100", "r500")(props),
      color: mode("r500", "r50")(props),
      borderRadius: "1rem",
      h: "fit-content",
      p: "4px 0.5rem",
      fontSize: "16px",
      _hover: {
        boxShadow: mode(
          "0px 2px 0px rgba(243, 184, 183, 0.6)",
          "0px 2px 0px rgba(234, 129, 128, 0.7)"
        )(props),
      },
      _active: {
        color: "wMain",
        bgColor: mode("r400", "r300")(props),
        top: "1px",
        boxShadow: mode(
          "0px 1.45px 0px rgba(243, 184, 183, 0.6)",
          "0px 1.45px 0px rgba(234, 129, 128, 0.7)"
        )(props),
      },
    }),
    chipGreen: (props) => ({
      position: "relative",
      bgColor: mode("g100", "g500")(props),
      color: mode("g600", "g50")(props),
      borderRadius: "1rem",
      h: "fit-content",
      p: "4px 0.5rem",
      fontSize: "16px",
      _hover: {
        boxShadow: mode(
          "0px 2px 0px rgba(178, 224, 189, 0.6)",
          "0px 2px 0px rgba(118, 200, 137, 0.6)"
        )(props),
      },
      _active: {
        color: "wMain",
        bgColor: mode("g400", "g300")(props),
        top: "1px",
        boxShadow: mode(
          "0px 1.45px 0px rgba(178, 224, 189, 0.6)",
          "0px 1.45px 0px rgba(118, 200, 137, 0.6)"
        )(props),
      },
    }),
    chipYellow: (props) => ({
      position: "relative",
      bgColor: mode("p50", "p400")(props),
      color: mode("p500", "p50")(props),
      borderRadius: "1rem",
      h: "fit-content",
      p: "4px 0.5rem",
      fontSize: "16px",
      _hover: {
        boxShadow: mode(
          "0px 2px 0px rgba(253, 231, 174, 0.6)",
          "0px 2px 0px rgba(253, 207, 73, 0.7)"
        )(props),
      },
      _active: {
        color: "wMain",
        bgColor: mode("p400", "p200")(props),
        top: "1px",
        boxShadow: mode(
          "0px 1.45px 0px rgba(253, 231, 174, 0.6)",
          "0px 1.45px 0px rgba(253, 207, 73, 0.7)"
        )(props),
      },
    }),

    blackjackBlue: {
      position: "relative",
      bgColor: "rgba(69, 112, 228, 0.9)",
      color: "rgba(0, 0, 0, 0.75)",
      borderWidth: "1px",
      borderBottomWidth: "3px",
      borderColor: "rgba(0, 0, 0, 0.75)",
      boxShadow: "md",
      _hover: {
        bgColor: "#4570E4",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
      },
      _focusVisible: {
        bgColor: "#4570E4",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
        outline: "auto",
      },
      _active: {
        bgColor: "#1E4ECF",
        borderBottomWidth: "2px",
        top: "2px",
      },
    },
    blackjackWhite: {
      position: "relative",
      bgColor: "#ECECEC",
      color: "rgba(0, 0, 0, 0.75)",
      borderWidth: "1px",
      borderBottomWidth: "3px",
      borderColor: "rgba(0, 0, 0, 0.75)",
      boxShadow: "md",
      _hover: {
        bgColor: "#F4F4F4",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
      },
      _focusVisible: {
        bgColor: "#F4F4F4",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
        outline: "auto",
      },
      _active: {
        bgColor: "#FFF",
        borderBottomWidth: "2px",
        top: "2px",
      },
    },
    blackjackGreen: {
      position: "relative",
      bgColor: "rgba(73, 181, 99, 0.9)",
      color: "rgba(0, 0, 0, 0.75)",
      borderWidth: "1px",
      borderBottomWidth: "3px",
      borderColor: "rgba(0, 0, 0, 0.75)",
      boxShadow: "md",
      _hover: {
        bgColor: "g500",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
      },
      _focusVisible: {
        bgColor: "g500",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
        outline: "auto",
      },
      _active: {
        bgColor: "g600",
        borderBottomWidth: "2px",
        top: "2px",
      },
    },
    blackjackRed: {
      position: "relative",
      bgColor: "rgba(227, 88, 85, 0.9)",
      color: "rgba(0, 0, 0, 0.75)",
      borderWidth: "1px",
      borderBottomWidth: "3px",
      borderColor: "rgba(0, 0, 0, 0.75)",
      boxShadow: "md",
      _hover: {
        bgColor: "r500",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
      },
      _focusVisible: {
        bgColor: "r500",
        color: "#000",
        borderColor: "#000",
        boxShadow: "lg",
        outline: "auto",
      },
      _active: {
        bgColor: "r600",
        borderBottomWidth: "2px",
        top: "2px",
      },
    },
  },
});
