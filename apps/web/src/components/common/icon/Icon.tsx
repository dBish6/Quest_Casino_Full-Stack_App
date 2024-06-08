export type IconIds = keyof typeof iconLib;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  id: IconIds;
}

/**
 * Renders an SVG icon.
 */
// prettier-ignore
export default function Icon({id, fill = "var(--c-purple-50)", ...props}: IconProps) {
  const icon = iconLib[id as keyof typeof iconLib];

  return (
    <svg
      aria-label={icon["aria-label"]}
      width={icon.size.width}
      height={icon.size.height}
      viewBox={`0 0 ${icon.size.width} ${icon.size.height}`}
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
  "adjust-16": {
    id: "adjust-16",
    size: { width: "16", height: "16.656" },
    "aria-label": "Settings",
  },

  "badge-48": {
    id: "badge-48",
    size: { width: "48.003", height: "39.507" },
    "aria-label": "Identification",
  },

  "bell-25": {
    id: "bell-25",
    size: { width: "25.782", height: "27.998" },
    "aria-label": "Notifications",
  },
  "bell-22": {
    id: "bell-22",
    size: { width: "21.1", height: "23.999" },
    "aria-label": "Notifications",
  },

  "check-mark-24": {
    id: "check-mark-24",
    size: { width: "24", height: "16.961" },
    "aria-label": "Success",
  },

  "discord-20": {
    id: "discord-20",
    size: { width: "19.997", height: "15.21" },
    "aria-label": "Discord",
  },

  "edit-16": {
    id: "edit-16",
    size: { width: "16", height: "16.049" },
    "aria-label": "Edit Item",
  },

  "enter-45": {
    id: "enter-45",
    size: { width: "45", height: "45.562" },
    "aria-label": "Enter",
  },

  "exit-19": {
    id: "exit-19",
    size: { width: "19", height: "19" },
    "aria-label": "Exit",
  },
  "exit-14": {
    id: "exit-14",
    size: { width: "14", height: "14" },
    "aria-label": "Exit",
  },
  "exit-10": {
    id: "exit-10",
    size: { width: "10", height: "10" },
    "aria-label": "Exit",
  },

  "expand-18": {
    id: "expand-18",
    size: { width: "18", height: "10" },
    "aria-label": "Expand",
  },
  "expand-16": {
    id: "expand-18",
    size: { width: "16", height: "8.889" },
    "aria-label": "Expand",
  },
  "expand-14": {
    id: "expand-14",
    size: { width: "14", height: "7.778" },
    "aria-label": "Expand",
  },

  "eye-18": {
    id: "eye-18",
    size: { width: "18.002", height: "9.061" },
    "aria-label": "Hide Password",
  },
  "eye-closed-18": {
    id: "eye-closed-18",
    size: { width: "17.998", height: "15.007" },
    "aria-label": "Show Password",
  },

  "facebook-18": {
    id: "facebook-18",
    size: { width: "18", height: "18" },
    "aria-label": "Facebook",
  },

  "gift-16": {
    id: "gift-16",
    size: { width: "15.996", height: "16.714" },
    "aria-label": "Bonuses",
  },

  "google-24": {
    id: "google-24",
    size: { width: "24.002", height: "24.484" },
    "aria-label": "Google",
  },

  "info-24": {
    id: "info-24",
    size: { width: "24", height: "24" },
    "aria-label": "Info",
  },

  "instagram-18": {
    id: "instagram-18",
    size: { width: "18", height: "18" },
    "aria-label": "Instagram",
  },

  "joystick-16": {
    id: "joystick-16",
    size: { width: "15.996", height: "17.714" },
    "aria-label": "Games",
  },

  "list-16": {
    id: "list-16",
    size: { width: "15.998", height: "16.328" },
    "aria-label": "Leaderboard",
  },

  "quote-16": {
    id: "quote-16",
    size: { width: "16.003", height: "12.609" },
    "aria-label": "Quote",
  },
  "quote-12": {
    id: "quote-12",
    size: { width: "12", height: "9.455" },
    "aria-label": "Quote",
  },

  "scroll-28": {
    id: "scroll-28",
    size: { width: "28", height: "25.333" },
    "aria-label": "Quests",
  },
  "scroll-16": {
    id: "scroll-28",
    size: { width: "16", height: "14.476" },
    "aria-label": "Quests",
  },

  "send-24": {
    id: "send-24",
    size: { width: "24", height: "24.038" },
    "aria-label": "Send",
  },
  "send-18": {
    id: "send-18",
    size: { width: "18", height: "18.028" },
    "aria-label": "Send",
  },

  "warning-24": {
    id: "warning-24",
    size: { width: "24", height: "24.327" },
    "aria-label": "Warning",
  },
};
