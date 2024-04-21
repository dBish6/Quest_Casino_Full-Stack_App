import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";
import s from "./button.module.css";

const button = cva(s.button, {
  variants: {
    intent: {
      primary: s.primary,
      secondary: s.secondary,
      exit: `${s.icon} ${s.exit}`,
    },
    size: {
      sm: s.sm,
      md: s.md,
      lrg: s.lrg,
      xl: s.xl,
    },
  },
  compoundVariants: [{ intent: "primary", size: "md", className: s.button }],
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

interface ButtonProps
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
        className={`${button({ intent, size, className })}${iconBtn ? " " + s.icon : ""}`}
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
        {children}
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
