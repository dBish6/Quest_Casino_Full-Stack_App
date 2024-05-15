import type { VariantProps } from "class-variance-authority";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import keyPress from "@utils/keyPress";

import { Icon } from "@components/common/icon";

import s from "./button.module.css";

const button = cva(s.button, {
  variants: {
    intent: {
      primary: s.primary,
      secondary: s.secondary,
      ghost: s.ghost,
      exit: `${s.icon} ${s.exit}`,
    },
    size: {
      sm: s.sm,
      md: s.md,
      lrg: s.lrg,
      xl: s.xl,
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "xl",
  },
});

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof button> {
  asChild?: boolean;
  iconBtn?: boolean;
}

// prettier-ignore
const Button = forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
  ({ children, className, intent, size, asChild, iconBtn, ...props }, ref) => {
    const Element = asChild ? Slot : "button";

    return (
      <Element
        ref={ref}
        className={`${button({ className, intent, size })}${iconBtn ? " " + s.icon : ""}`}
        {...props}
        onKeyDown={(e) => {
          keyPress(e, () =>
            (e.target as HTMLButtonElement).setAttribute(
              "data-key-press",
              "true"
            )
          );
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        onKeyUp={(e) => {
          keyPress(e, () =>
            (e.target as HTMLButtonElement).removeAttribute("data-key-press")
          );
          if (props.onKeyDown) props.onKeyDown(e);
        }}
      >
        {intent === "exit" ? (
          size === "xl" ? (
            <Icon id="exit-19" fill="var(--c-purple-800)" />
          ) : (
            <Icon id="exit-14" fill="var(--c-status-red)" />
          )
        ) : (
          children
        )}
      </Element>
    );
  }
);
export default Button;
