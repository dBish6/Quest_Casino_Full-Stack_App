import type { LinkProps as RouterLinkProps } from "react-router-dom";
import type { VariantProps } from "class-variance-authority";

import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import keyPress from "@utils/keyPress";

import s from "./link.module.css";

const link = cva(s.link, {
  variants: {
    intent: {
      primary: s.primary,
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface LinkProps extends RouterLinkProps, VariantProps<typeof link> {
  to: string;
  asChild?: boolean;
  external?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  ({ children, to, className, intent, asChild, external, ...props }, ref) => {
    const Element = asChild ? Slot : external ? "a" : RouterLink;

    return (
      <Element
        to={to}
        {...(external &&
          (Element !== "a"
            ? {
                onClick: () => window.open(to, "_blank", "noopener,noreferrer"),
              }
            : {
                href: to,
                target: "_blank",
                rel: "noopener noreferrer",
              }))}
        ref={ref}
        className={link({ className, intent })}
        {...props}
        onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
          keyPress(e, () =>
            (e.target as HTMLAnchorElement).setAttribute(
              "data-key-press",
              "true"
            )
          );
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        onKeyUp={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
          keyPress(e, () =>
            (e.target as HTMLAnchorElement).removeAttribute("data-key-press")
          );
          if (props.onKeyDown) props.onKeyDown(e);
        }}
      >
        {children}
      </Element>
    );
  }
);

export default Link;
