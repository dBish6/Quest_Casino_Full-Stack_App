import { forwardRef, useRef } from "react";

import s from "./image.module.css";

export interface ImageProps extends React.ComponentProps<"img"> {
  src: string;
  alt: string;
  load?: boolean;
  size?: {
    width?: string;
    height?: string;
    fit?: React.CSSProperties["objectFit"];
    position?: string;
  };
  fill?: boolean;
}

// FIXME:
const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, load = true, size, fill, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={containerRef}
        role="presentation"
        className={`${s.container}${load ? " " + s.load : ""}`}
        style={{
          ...(fill
            ? { width: "100%", height: "100%" }
            : size &&
              Object.keys(size).length && {
                ...(size.width && {
                  width: "100%",
                  maxWidth: size.width ?? "",
                }),
                ...(size.height && {
                  height: "100%",
                  maxHeight: size.height ?? "",
                }),
              }),
        }}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          {...props}
          style={{
            ...(fill
              ? { width: "100%", height: "100%" }
              : size &&
                Object.keys(size).length && {
                  ...(size.width && {
                    width: "100%",
                  }),
                  ...(size.height && {
                    height: "100%",
                    maxHeight: size.height ?? "",
                  }),
                  objectFit: size.fit || "cover",
                  objectPosition: size.position || "center",
                  ...props.style,
                }),
          }}
          {...(load && {
            loading: "lazy",
            onLoad: (e) => {
              containerRef.current!.setAttribute("data-loaded", "true");

              if (props.onLoad) props.onLoad(e);
            },
          })}
        />
      </div>
    );
  }
);

export default Image;
