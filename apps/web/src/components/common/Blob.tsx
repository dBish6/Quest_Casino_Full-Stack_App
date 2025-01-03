type SvgElements = React.ReactElement<
  | React.SVGProps<SVGPathElement>
  | React.SVGProps<SVGGElement>
  | React.SVGProps<SVGCircleElement>
  | React.SVGProps<SVGRectElement>
  | React.SVGProps<SVGPolygonElement>
  | React.SVGProps<SVGEllipseElement>
  | React.SVGProps<SVGLineElement>
>;

export interface BlobProps extends React.ComponentProps<"svg"> {
  children: SvgElements | SvgElements[];
  svgWidth: number;
  svgHeight: number;
}

/**
 * Creates responsive SVG elements.
 */
export default function Blob({ children, className, svgWidth, svgHeight, style, ...props }: BlobProps) {
  return (
    <div
      aria-hidden="true"
      className={`blob${className ? " " + className : ""}`}
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: `${svgWidth}px`,
        height: `${svgHeight}px`,
        pointerEvents: "none",
        ...style
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMin meet"
        {...props}
      >
        {children}
      </svg>
    </div>
  );
}
