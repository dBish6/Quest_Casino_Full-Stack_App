import type { VariantProps } from "class-variance-authority";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import keyPress from "@utils/keyPress";

import { Icon } from "@components/common";

import s from "./button.module.css";

const button = cva(s.button, {
  variants: {
    intent: {
      primary: s.primary,
      secondary: s.secondary,
      ghost: s.ghost,
      exit: `${s.icon} ${s.exit}`,
      "exit ghost": `${s.icon} ${s.exit} ${s.ghost}`,
    },
    size: {
      xsm: s.xsm,
      sm: s.sm,
      md: s.md,
      lrg: s.lrg,
      xl: s.xl,
    },
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
    const iconFill = intent?.includes("ghost") ? "var(--c-status-red)" : "var(--c-purple-800)"

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
        {intent?.includes("exit") ? (
          size === "xl" ? (
            <Icon id="exit-19" fill={iconFill} />
          ) : intent.includes("ghost") ? (
            <Icon id="exit-14" fill={iconFill} />
          ) : (
            <Icon id="exit-10" fill={iconFill} />
          )
        ) : (
          children
        )}
      </Element>
    );
  }
);
export default Button;
