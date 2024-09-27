import type { HoverCardContentProps, HoverCardTriggerProps } from "@radix-ui/react-hover-card";
import type { VariantProps } from "class-variance-authority";

import { forwardRef } from "react";
import { Root, Trigger as RTrigger, Portal, Content, Arrow } from "@radix-ui/react-hover-card";
import { cva } from "class-variance-authority";

import s from "./hoverCard.module.css";

const hoverCard = cva(s.hoverCard, {
  variants: {
    intent: {
      primary: s.primary,
    }
  },
  defaultVariants: {
    intent: "primary"
  },
});

export interface HoverCardProps
  extends Omit<HoverCardContentProps, "children">,
    VariantProps<typeof hoverCard> {
  children: (props: { Arrow: typeof Arrow }) => React.ReactElement;
  Trigger: (triggerProps: HoverCardTriggerProps) => React.ReactElement;
  arrow?: boolean;
  open?: boolean;
}

const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  ({ children, Trigger, className, intent, arrow, open, ...props }, ref) => {
    console.log("className", className)
    
    return (
      <Root open={open}>
        <RTrigger asChild>
          {Trigger({})}
        </RTrigger>

        <Portal>
          <Content
            ref={ref}
            className={hoverCard({ className, intent })}
            // side="top"
            sideOffset={6}
            {...props}
          >
            {children({ Arrow })}
          </Content>
        </Portal>
      </Root>
    );
  }
);

export default HoverCard;
