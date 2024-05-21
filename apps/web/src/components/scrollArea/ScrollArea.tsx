import type { ScrollAreaProps as RScrollAreaProps } from "@radix-ui/react-scroll-area";
import type { VariantProps } from "class-variance-authority";

import { forwardRef } from "react";
import {
  Root,
  Viewport,
  Scrollbar,
  Thumb,
  Corner,
} from "@radix-ui/react-scroll-area";
import { cva } from "class-variance-authority";

import s from "./scrollArea.module.css";

const scrollArea = cva(s.scrollArea, {
  variants: {
    intent: {
      primary: s.primary,
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface ScrollAreaProps
  extends RScrollAreaProps,
    VariantProps<typeof scrollArea> {
  orientation: "vertical" | "horizontal" | "both";
}

// prettier-ignore
const ScrollArea = forwardRef<HTMLDivElement, React.PropsWithChildren<ScrollAreaProps>>(
  ({ children, orientation, className, intent, ...props }, ref) => {
    return (
      <Root
        ref={ref}
        className={scrollArea({ className, intent })}
        type="auto"
        {...props}
      >
        <Viewport className="viewport">{children}</Viewport>
        {["vertical", "both"].includes(orientation) && (
          <Scrollbar className="scrollbar" orientation="vertical">
            <Thumb />
          </Scrollbar>
        )}
        {["horizontal", "both"].includes(orientation) && (
          <Scrollbar className="scrollbar" orientation="horizontal">
            <Thumb />
          </Scrollbar>
        )}
        {orientation === "both" && <Corner />}
      </Root>
    );
  }
);

export default ScrollArea;
