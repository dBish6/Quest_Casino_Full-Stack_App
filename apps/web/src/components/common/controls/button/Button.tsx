import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

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
    size: "md",
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
  ({ children, className, intent = "primary", size = "lrg", asChild, iconBtn, ...props }, ref) => {
    const Element = asChild ? Slot : "button";

    return (
      <Element
        ref={ref}
        className={`${button({ className, intent, size })}${iconBtn ? " " + s.icon : ""}`}
        onKeyDown={(e) =>
          keyPress(e, () =>
            (e.target as HTMLButtonElement).setAttribute(
              "data-key-press",
              "true"
            )
          )
        }
        onKeyUp={(e) =>
          keyPress(e, () =>
            (e.target as HTMLButtonElement).removeAttribute("data-key-press")
          )
        }
        {...props}
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

const keyPress = (
  e: React.KeyboardEvent<HTMLButtonElement>,
  callback: () => void
) => {
  if (e.key === "Enter" || e.key === " ") callback();
};