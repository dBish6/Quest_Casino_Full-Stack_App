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
    scrollbarSize: {
      "3": s.three,
      "5": s.five,
    },
  },
  defaultVariants: {
    intent: "primary",
    scrollbarSize: "3",
  },
});

export interface ScrollAreaProps
  extends RScrollAreaProps,
    VariantProps<typeof scrollArea> {
  orientation: "vertical" | "horizontal" | "both";
}

const ScrollArea = forwardRef<HTMLDivElement, React.PropsWithChildren<ScrollAreaProps>>(
  ({ children, orientation, className, intent, scrollbarSize, ...props }, ref) => {
    return (
      <Root
        ref={ref}
        className={scrollArea({ className, intent, scrollbarSize })}
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
