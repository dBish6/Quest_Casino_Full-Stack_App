import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// *Component Imports*
import { tabsStyles as Tabs } from "./components/tabsStyles";
import { buttonStyles as Button } from "./components/buttonStyles";

// Main App Theme
const casinoTheme = extendTheme({
  // Global Overrides
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#E0E2EA", "bd800")(props),
        color: mode("bMain", "dwordMain")(props),
      },
    }),
  },
  components: {
    Tabs: {
      baseStyle: (props) => ({
        tab: {
          color: mode("bMain", "wMain")(props),
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
            opacity: "1",
          },
        },
      }),
    },
    Text: {
      baseStyle: {
        wordBreak: "keep-all",
      },
    },
    Heading: {
      baseStyle: (props) => ({
        color: mode("r500", "p400")(props),
        fontWeight: "400",
      }),
    },
    Container: {
      baseStyle: {
        padding: "0",
      },
    },
    Link: {
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
      },
    },
    Icon: {
      baseStyle: {
        transition: "0.3s ease",
      },
      variants: {
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
    },
    // FIXME:
    // chakra: {
    //   aside: {
    //     baseStyle: (props) => ({
    //       bgColor: mode("bl400", "#424B5E")(props),
    //     }),
    //   },
    // },
    // FIXME:
    chakra: {
      baseStyle: {
        span: {
          color: "blue.500",
        },
      },
    },
    FormLabel: {
      baseStyle: {
        mb: "6px",
      },
    },
    Input: {
      baseStyle: (props) => ({
        field: {
          // FIXME:
          // borderWidth: "1px",
          // borderColor: mode(
          //   "rgba(54, 54, 54, 0.20) !important",
          //   "rgba(244, 244, 244, 0.20) !important"
          // )(props),
          _hover: {
            boxShadow: "lg",
          },
          _groupHover: {
            boxShadow: "lg",
          },
          _focusVisible: {
            outline: "none",
          },
          _focus: {
            borderColor: mode("g500", "p500")(props),
            boxShadow: "lg",
          },
          transition: "0.38s ease",
        },
      }),
    },
    Button,
  },
  colors: {
    // Primary Colours
    p50: "#FCF3DC",
    p100: "#FDE7AE",
    p200: "#FCDA7E",
    p300: "#FDCF49",
    p400: "#FEC422",
    p500: "#FFBB00",
    p600: "#FFAE00",
    p700: "#FD9900",
    p800: "#FE8B05",
    p900: "#FD6706",

    // Background Dark
    bd100: "#C3C9D5",
    bd200: "#A7AEBC",
    bd300: "#8A93A7",
    bd400: "#778197",
    bd500: "#616D86",
    bd600: "#535E75",
    bd700: "#424B5E",
    bd800: "#323948",
    bd900: "#202631",

    // Background Light
    bl200: "#EEF0F8",
    bl300: "#E0E2EA",
    bl400: "#CCD1DA",
    bl500: "#BCBEC5",
    bl600: "#9EA0A7",
    bl700: "#75777D",

    // Accent 1
    g50: "#D4EEDA",
    g100: "#C5E8CD",
    g200: "#B2E0BD",
    g300: "#98D6A7",
    g400: "#76C889",
    g500: "#49B563",
    g600: "#3E9A53",
    g700: "#358347",
    g800: "#2D6F3C",
    g900: "#265E33",

    // Accent 2
    r50: "#F8D7D7",
    r100: "#F6CAC9",
    r200: "#F3B8B7",
    r300: "#EFA19F",
    r400: "#EA8180",
    r500: "#E35855",
    r600: "#DC302D",
    r700: "#C22320",
    r800: "#A51D1B",
    r900: "#8C1917",

    // Whites
    wMain: "#F4F4F4",

    // Blacks
    bMain: "#363636",

    dwordMain: "#E0E2EA",
  },
  fonts: {
    body: "Hind Siliguri, sans-serif",
    heading: "Lobster, cursive",
    roboto: "Roboto, sans-serif",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default casinoTheme;
