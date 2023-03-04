import { defineStyleConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const tabsStyles = defineStyleConfig({
  variants: {
    navigation: (props) => ({
      tab: {
        color: mode("bMain", "wMain")(props),
        borderBottom: "1px",
        borderColor: mode("borderL", "borderD")(props),
        opacity: "0.7",
        _hover: {
          bgColor: mode("rgb(244, 244, 244, 0.4)", "rgb(244, 244, 244, 0.2)"),
        },
        _active: {
          bgColor: mode(
            "rgb(244, 244, 244, 0.6)",
            "rgb(244, 244, 244, 0.5)"
          )(props),
        },
        _selected: {
          color: mode("r500", "p500")(props),
          borderColor: mode("r500", "p500")(props),
          opacity: "1",
        },
      },
    }),
  },
});
