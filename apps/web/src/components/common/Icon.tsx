import { clampify } from "css-clamper";

export type IconIds = keyof typeof iconLib;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "scale"> {
  id: IconIds;
  scaleWithText?: boolean;
}

/**
 * Renders an SVG icon.
 */
export default function Icon({id, fill = "var(--c-purple-50)", scaleWithText, style, ...props}: IconProps) {
  const icon = iconLib[id as keyof typeof iconLib],
    { width, height } = icon.size;

  const handleFontScale = (elem: SVGSVGElement | null) => {
    if (elem && elem.getAttribute("data-init") !== "true") {
      const style = elem.style,
        numWidth = parseFloat(width)

      elem.parentElement!.style.display = "inline-flex"

      style.width = clampify(`${numWidth - 4}px`, `${numWidth}px`, "615px", "1640px");
      style.height = "auto";
      elem.setAttribute("data-init", "true")
    }
  };

  return (
    <svg
      {...(scaleWithText && { ref: handleFontScale })}
      aria-label={icon["aria-label"]}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      {...props}
    >
      <use href={`/icons/sprite.svg#${icon.id}`} fill={fill} />
    </svg>
  );
}

/**
 * The collection icons with their IDs to access the icons and default aria-labels.
 */
const iconLib = {
  "add-15": {
    id: "add",
    size: { width: "15", height: "15" },
    "aria-label": "Add",
  },
  "add-10": {
    id: "add",
    size: { width: "10", height: "10" },
    "aria-label": "Add",
  },

  "adjust-16": {
    id: "adjust",
    size: { width: "16", height: "16.656" },
    "aria-label": "Settings",
  },

  "all-24": {
    id: "all",
    size: { width: "24", height: "11.111" },
    "aria-label": "All",
  },

  "alarm-clock-32": {
    id: "alarm-clock",
    size: { width: "31.998", height: "29.844" },
    "aria-label": "Soon",
  },

  "badge-48": {
    id: "badge",
    size: { width: "48.003", height: "39.507" },
    "aria-label": "Identification",
  },

  "bell-45": {
    id: "bell",
    size: { width: "44.999", height: "48.866" },
    "aria-label": "Notifications",
  },
  "bell-25": {
    id: "bell",
    size: { width: "25.782", height: "27.998" },
    "aria-label": "Notifications",
  },
  // Only used in testing, will change probably.
  "bell-22": {
    id: "bell",
    size: { width: "21.1", height: "23.999" },
    "aria-label": "Notifications",
  },

  "border-horizontal-24": {
    id: "border-horizontal",
    size: { width: "24.001", height: "24.085" },
    "aria-label": "Categorize",
  },

  "cards-24": {
    id: "cards",
    size: { width: "24", height: "24.799" },
    "aria-label": "Cards",
  },

  "check-mark-24": {
    id: "check-mark",
    size: { width: "24", height: "16.961" },
    "aria-label": "Success",
  },

  "delete-19": {
    id: "delete",
    size: { width: "18.858", height: "23.999" },
    "aria-label": "Delete",
  },

  "dice-24": {
    id: "dice",
    size: { width: "23.999", height: "23.536" },
    "aria-label": "Dice",
  },

  "discord-20": {
    id: "discord",
    size: { width: "19.997", height: "15.21" },
    "aria-label": "Discord",
  },

  "edit-16": {
    id: "edit",
    size: { width: "16", height: "16.049" },
    "aria-label": "Edit Item",
  },

  "enter-45": {
    id: "enter",
    size: { width: "45", height: "45.562" },
    "aria-label": "Enter",
  },

  "exit-19": {
    id: "exit",
    size: { width: "19", height: "19" },
    "aria-label": "Exit",
  },
  "exit-14": {
    id: "exit",
    size: { width: "14", height: "14" },
    "aria-label": "Exit",
  },
  "exit-10": {
    id: "exit",
    size: { width: "10", height: "10" },
    "aria-label": "Exit",
  },

  "expand-35": {
    id: "expand-bold",
    size: { width: "35.5", height: "15" },
    "aria-label": "Expand",
  },
  "expand-23": {
    id: "expand-wide",
    size: { width: "23", height: "12" },
    "aria-label": "Expand",
  },
  "expand-22": {
    id: "expand-wide",
    size: { width: "22", height: "12" },
    "aria-label": "Expand",
  },
  "expand-18": {
    id: "expand-sharp",
    size: { width: "18", height: "10" },
    "aria-label": "Expand",
  },
  "expand-16": {
    id: "expand-sharp",
    size: { width: "16", height: "8.889" },
    "aria-label": "Expand",
  },
  "expand-14": {
    id: "expand-sharp",
    size: { width: "14", height: "7.778" },
    "aria-label": "Expand",
  },

  "eye-18": {
    id: "eye",
    size: { width: "18.002", height: "9.061" },
    "aria-label": "Hide Password",
  },
  "eye-closed-18": {
    id: "eye-closed",
    size: { width: "17.998", height: "15.007" },
    "aria-label": "Show Password",
  },

  "facebook-18": {
    id: "facebook",
    size: { width: "18", height: "18" },
    "aria-label": "Facebook",
  },

  "gift-48": {
    id: "gift",
    size: { width: "48", height: "50.155" },
    "aria-label": "Bonuses",
  },
  "gift-20": {
    id: "gift",
    size: { width: "20", height: "20.898" },
    "aria-label": "Bonuses",
  },
  "gift-16": {
    id: "gift",
    size: { width: "15.996", height: "16.714" },
    "aria-label": "Bonuses",
  },

  "google-24": {
    id: "google",
    size: { width: "24.002", height: "24.484" },
    "aria-label": "Google",
  },

  "hand-cash-48": {
    id: "hand-cash",
    size: { width: "48", height: "38.17" },
    "aria-label": "Cash In",
  },

  "heart-24": {
    id: "heart",
    size: { width: "24", height: "19.849" },
    "aria-label": "Favourite",
  },
  "heart-13": {
    id: "heart",
    size: { width: "13.319", height: "11.015" },
    "aria-label": "Favourite",
  },

  "infinity-24": {
    id: "infinity",
    size: { width: "24", height: "11.111" },
    "aria-label": "All",
  },

  "info-24": {
    id: "info",
    size: { width: "24", height: "24" },
    "aria-label": "Info",
  },
  "info-21": {
    id: "info",
    size: { width: "21", height: "21" },
    "aria-label": "Info",
  },
  "info-12": {
    id: "info",
    size: { width: "12", height: "12" },
    "aria-label": "Info",
  },

  "instagram-18": {
    id: "instagram",
    size: { width: "18", height: "18" },
    "aria-label": "Instagram",
  },

  "joystick-32": {
    id: "joystick",
    size: { width: "31.997", height: "35.432" },
    "aria-label": "Games",
  },
  "joystick-16": {
    id: "joystick",
    size: { width: "15.996", height: "17.714" },
    "aria-label": "Games",
  },

  "list-48": {
    id: "list",
    size: { width: "47.996", height: "48.41" },
    "aria-label": "Leaderboard",
  },
  "list-20": {
    id: "list",
    size: { width: "19.999", height: "20.411" },
    "aria-label": "Leaderboard",
  },
  "list-16": {
    id: "list",
    size: { width: "15.998", height: "16.328" },
    "aria-label": "Leaderboard",
  },

  "quote-12": {
    id: "quote",
    size: { width: "12", height: "9.455" },
    "aria-label": "Quote",
  },

  "refresh-24": {
    id: "refresh",
    size: { width: "23.998", height: "19.595" },
    "aria-label": "Refresh Users",
  },

  "scroll-48": {
    id: "scroll",
    size: { width: "47.996", height: "43.425" },
    "aria-label": "Quests",
  },
  "scroll-28": {
    id: "scroll",
    size: { width: "28", height: "25.333" },
    "aria-label": "Quests",
  },
  "scroll-20": {
    id: "scroll",
    size: { width: "19.999", height: "18.094" },
    "aria-label": "Quests",
  },
  "scroll-16": {
    id: "scroll",
    size: { width: "16", height: "14.476" },
    "aria-label": "Quests",
  },

  "search-24": {
    id: "search",
    size: { width: "24", height: "24.11" },
    "aria-label": "Search",
  },
  "search-21": {
    id: "search",
    size: { width: "20.996", height: "21.022" },
    "aria-label": "Search",
  },
  "search-18": {
    id: "search",
    size: { width: "18.003", height: "18.085" },
    "aria-label": "Search",
  },

  "send-24": {
    id: "send",
    size: { width: "24", height: "24.038" },
    "aria-label": "Send",
  },
  "send-18": {
    id: "send",
    size: { width: "18", height: "18.028" },
    "aria-label": "Send",
  },

  "slot-machine-24": {
    id: "slot-machine",
    size: { width: "24", height: "23.982" },
    "aria-label": "Slots",
  },

  "speech-bubble-32": {
    id: "speech-bubble",
    size: { width: "32", height: "29.584" },
    "aria-label": "Reply",
  },
  "speech-bubble-24": {
    id: "speech-bubble",
    size: { width: "24", height: "21.377" },
    "aria-label": "Reply",
  },

  "user-45": {
    id: "user",
    size: { width: "45.01", height: "48.471" },
    "aria-label": "Profile",
  },
  "user-24": {
    id: "user",
    size: { width: "23.998", height: "25.844" },
    "aria-label": "Profile",
  },

  "warning-24": {
    id: "warning",
    size: { width: "24", height: "24.327" },
    "aria-label": "Warning",
  },
};
