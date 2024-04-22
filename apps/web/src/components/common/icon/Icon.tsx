interface IconProps extends React.SVGProps<SVGSVGElement> {
  id: keyof typeof iconLib;
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

  "edit-24": {
    id: "edit-24",
    size: { width: "24", height: "24.073" },
    "aria-label": "Edit Item",
  },

  "eye-18": {
    id: "eye-18",
    size: { width: "18.002", height: "9.061" },
    "aria-label": "Hide",
  },
  "eye-closed-18": {
    id: "eye-closed-18",
    size: { width: "17.998", height: "15.007" },
    "aria-label": "Visible",
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

  "google-24": {
    id: "google-24",
    size: { width: "24", height: "24.484" },
    "aria-label": "Google Icon",
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
};
