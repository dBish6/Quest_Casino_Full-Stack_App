export interface BlobProps extends React.ComponentProps<"div"> {
  children: React.ReactElement<SVGSVGElement>;
  svgWidth: React.CSSProperties["maxWidth"];
  svgHeight: React.CSSProperties["height"];
}

/**
 * Creates responsive SVG elements.
 */
export default function Blob({
  children,
  className,
  svgWidth,
  svgHeight,
  style,
  ...props
}: BlobProps) {
  return (
    <div
      aria-hidden="true"
      className={`blob${className ? " " + className : ""}`}
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: svgWidth,
        height: svgHeight,
        pointerEvents: "none",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
