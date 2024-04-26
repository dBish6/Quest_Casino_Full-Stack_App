import { forwardRef, useRef } from "react";
import { Label } from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { Icon } from "@components/common/icon";

import "../input-select.css";
import s from "./select.module.css";

const select = cva("select", {
  variants: {
    intent: {
      primary: "primary",
      callingCode: "callingCode",
    },
    size: {
      md: "md",
      lrg: "lrg",
    },
  },
  defaultVariants: {
    size: "lrg",
  },
});

export interface SelectProps
  extends Omit<React.ComponentProps<"select">, "size">,
    VariantProps<typeof select> {
  label: string;
  name: string;
  id: string;
  error?: string;
}

// prettier-ignore
export const Input = forwardRef<HTMLSelectElement,React.PropsWithChildren<SelectProps>>(
  ({ children, label, className, intent, size = "lrg", style, error, ...props }, ref) => {
    const selectContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role="presentation"
        aria-live="assertive"
        className={`control ${s.container}`}
        style={style}
      >
        <div
          ref={selectContainerRef}
          className={select({ className, intent, size })}
          onClick={() => {
            const selectContainer = selectContainerRef.current!;
            selectContainer.getAttribute("focused")
              ? selectContainerRef.current!.removeAttribute("focused")
              : selectContainerRef.current!.setAttribute("focused", "true");
          }}
        >
          <Label htmlFor={props.id}>
            {label}
            {props.required && (
              <span aria-hidden="true" className="required">
                *
              </span>
            )}
          </Label>
          <select
            aria-describedby="formError"
            {...(error && { "aria-invalid": true })}
            ref={ref}
            onBlur={() =>
              selectContainerRef.current!.removeAttribute("focused")
            }
            onKeyDown={(e) =>
              e.key === " " && selectContainerRef.current!.click()
            }
            onChange={(e) => {
              const selectContainer = selectContainerRef.current!;
              !e.target.value.length
                ? selectContainer.removeAttribute("selected")
                : selectContainer.setAttribute("selected", "true");
            }}
            {...props}
          >
            <option value="" />
            {children}
          </select>
          <Icon
            id={
              size === "lrg"
                ? intent === "callingCode"
                  ? "expand-16"
                  : "expand-18"
                : "expand-14"
            }
          />
        </div>
        {error && (
          <span role="status" id="formError" className={s.error}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Input;
