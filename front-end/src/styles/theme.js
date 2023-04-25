import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// *Component Imports*
import { buttonStyles as Button } from "./components/buttonStyles";
import { tabsStyles as Tabs } from "./components/tabsStyles";
import { linkStyles as Link } from "./components/linkStyles";
import { iconStyles as Icon } from "./components/iconStyles";
import { inputStyles as Input } from "./components/inputStyles";
import { selectStyles as Select } from "./components/selectStyles";
import { cardStyles as Card } from "./components/cardStyles";

// App Theme
const casinoTheme = extendTheme({
  // Global Overrides
  styles: {
    global: (props) => ({
      body: {
        bg: mode("bl300", "bd800")(props),
        color: mode("bMain", "dwordMain")(props),
      },
    }),
  },
  components: {
    Text: {
      baseStyle: {
        wordBreak: "keep-all",
      },
      variants: {
        blackjack: {
          color: "wMain",
          textShadow: "2px 1px 0px #000000",
        },
      },
    },
    Heading: {
      baseStyle: (props) => ({
        color: mode("r500", "p400")(props),
        fontWeight: "400",
      }),
      variants: {
        blackjack: {
          color: "wMain",
          textShadow: "2px 1px 0px #000000",
        },
      },
    },
    Container: {
      baseStyle: {
        padding: "0",
      },
    },
    Tooltip: {
      baseStyle: (props) => ({
        color: mode("wMain", "bMain")(props),
      }),
    },
    FormLabel: {
      baseStyle: {
        mb: "6px",
      },
    },
    Divider: {
      baseStyle: (props) => ({
        border: mode("1px solid borderL", "1px solid borderD")(props),
      }),
    },
    Progress: {
      variants: {
        lowStrength: {
          filledTrack: {
            bg: "r600",
          },
        },
        highStrength: {
          filledTrack: {
            bg: "g500",
          },
        },
      },
    },
    Button,
    Tabs,
    Link,
    Icon,
    Input,
    Select,
    Card,
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

    borderD: "rgba(244, 244, 244, 0.2)",
    borderL: "rgba(54, 54, 54, 0.2)",
    fadeD: "linear-gradient(180deg, #424B5E 40.79%, rgba(66, 75, 94, 0) 100%)",
    fadeL:
      "linear-gradient(179.81deg, #CCD1DA 40.79%, rgba(204, 209, 218, 0) 100%)",
  },
  fonts: {
    body: `'Hind Siliguri', sans-serif`,
    heading: `'Lobster', cursive`,
    roboto: `'Roboto', sans-serif`,
    fugaz: `'Fugaz One', cursive`,
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default casinoTheme;
