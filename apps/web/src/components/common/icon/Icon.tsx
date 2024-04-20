interface IconProps extends React.SVGProps<SVGSVGElement> {
  id: string;
  defaultSize?: boolean;
}

/**
 * Renders an SVG icon.
 */
// prettier-ignore
export default function Icon({ id, defaultSize, width, height, ...props }: IconProps) {
    const icon = defaultSize ? iconLib[id as keyof typeof iconLib] : null

  return (
    <svg
      {...props}
      width={icon ? icon.defaultSize.width : width}
      height={icon ? icon.defaultSize.height : height}
      viewBox={`0 0 ${icon ? icon.defaultSize.width : width} ${icon ? icon.defaultSize.height : height}`}
    >
      <use href={`/icons/sprite.svg#${id}`} />
    </svg>
  );
}

/**
 * The collection icons with their IDs to access the icons and default aria-labels.
 */
export const iconLib = {
  edit: {
    id: "edit",
    defaultSize: { width: "24", height: "24.073" },
    "aria-label": "Edit Item",
  },
};
