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
      <use href={`/icons/sprite.svg#${id}`} fill={fill} />
    </svg>
  );
}

/**
 * The collection icons with their IDs to access the icons and default aria-labels.
 */
const iconLib = {
  "bell-25": {
    id: "bell",
    size: { width: "25.782", height: "27.998" },
    "aria-label": "Notifications",
  },
  "bell-22": {
    id: "bell",
    size: { width: "21.1", height: "23.999" },
    "aria-label": "Notifications",
  },

  "edit-24": {
    id: "edit-24",
    size: { width: "24", height: "24.073" },
    "aria-label": "Edit Item",
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
};
