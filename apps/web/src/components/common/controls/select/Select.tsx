import type { VariantProps } from "class-variance-authority";

import { forwardRef, useRef } from "react";
import { Label } from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

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
  extends Omit<
      React.ComponentProps<"select">,
      "size" | "onBlur" | "onKeyDown" | "onChange"
    >,
    VariantProps<typeof select> {
  label: string;
  name: string;
  id: string;
  error?: string | null;
  Loader?: () => React.ReactElement;
  loaderTrigger?: boolean;
}

// prettier-ignore
export const Input = forwardRef<HTMLSelectElement,React.PropsWithChildren<SelectProps>>(
  ({ children, label, className, intent, size, style, error, Loader, loaderTrigger, ...props }, ref) => {
    const selectContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role="presentation"
        aria-live="assertive"
        className={`control ${s.container}`}
      >
        <div
          ref={selectContainerRef}
          className={select({ className, intent, size })}
          style={style}
          onClick={() => {
            const selectContainer = selectContainerRef.current!;
            selectContainer.getAttribute("data-focused")
              ? selectContainerRef.current!.removeAttribute("data-focused")
              : selectContainerRef.current!.setAttribute("data-focused", "true");
          }}
          data-disabled={props.disabled}
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
            {...(error && { "aria-errormessage": "formError", "aria-invalid": true })}
            {...(Loader && {"aria-busy": loaderTrigger})}
            ref={ref}
            onBlur={() =>
              selectContainerRef.current!.removeAttribute("data-focused")
            }
            onKeyDown={(e) =>
              e.key === " " && selectContainerRef.current!.click()
            }
            onChange={(e) => {
              const selectContainer = selectContainerRef.current!;
              !e.target.value.length
                ? selectContainer.removeAttribute("data-selected")
                : selectContainer.setAttribute("data-selected", "true");
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

          {Loader && (loaderTrigger && <Loader />)}
        </div>
        
        {error && (
          <small role="alert" id="formError" className={s.error}>
            {error}
          </small>
        )}
      </div>
    );
  }
);

export default Input;
