import { forwardRef } from "react";

import s from "./image.module.css";

export interface ImageProps extends Omit<React.ComponentProps<"img">, "loading" | "aria-busy"> {
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
    const handleLazyLoad = (img: HTMLImageElement) => {
      if (load && img.getAttribute("data-loaded") !== "true") {
        const complete = () => {
          img.parentElement!.setAttribute("data-loaded", "true");
          img.setAttribute("aria-busy", "false");

          img.onload = null;
          img.onerror = null;
        }

        if (img.complete) {
          complete();
        } else {
          img.onload = () => {
            complete();
          }
          img.onerror = () => {
            img.src = "/images/no-image.webp";
            complete();
          }
        }
      }
    }

    return (
      <div
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

            if (node) handleLazyLoad(node);
          }}
          src={src}
          alt={alt}
          {...props}

          {...(load && { "aria-busy": "true", loading: "lazy" })}
          style={{
            ...(fill
              ? { width: "100%", height: "100%", objectFit: "cover" }
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
