import { forwardRef, useRef } from "react";

import noImage from "/images/no-image.webp"
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

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, load = true, size, fill, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleImageLazyLoad = (img: HTMLImageElement) => {
      if (load) {
        let timeout: NodeJS.Timeout;

        const cleanUp = () => {
          if (img) {
            img.removeEventListener("load", handleLoad);
            img.removeEventListener("error", handleError);
          }
          clearTimeout(timeout);
        };

        const handleLoad = () => {
          if (containerRef.current) containerRef.current.setAttribute("data-loaded", "true");
          cleanUp();
        };
  
        const handleError = () => {
          if (img) img.src = noImage;
          cleanUp();
        };
  
        timeout = setTimeout(handleError, 15000);

        if (img.complete) handleLoad();
        else {
          img.addEventListener("load", handleLoad);
          img.addEventListener("error", handleError);
        }
      }
    }

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
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;

            if (node) handleImageLazyLoad(node);
          }}
          {...(load && { loading: "lazy" })}
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
        />
      </div>
    );
  }
);

export default Image;
