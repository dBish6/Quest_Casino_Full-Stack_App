import type { VariantProps } from "class-variance-authority";

import { forwardRef, useRef, cloneElement } from "react";
import { Label } from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { Icon } from "@components/common";

import "../input-select.css";
import s from "./select.module.css";

const select = cva("selectInner", {
  variants: {
    intent: {
      primary: "primary",
      callingCode: "callingCode",
      ghost: "ghost"
    },
    size: {
      md: "md",
      lrg: "lrg"
    }
  }
});

export interface SelectProps
  extends Omit<
      React.ComponentProps<"select">,
      "size" | "required" | "onBlur" | "onKeyDown" | "onChange"
    >,
    VariantProps<typeof select> {
  label: string;
  id: string;
  hideLabel?: boolean;
  required?: boolean | "show";
  error?: string | null;
  Loader?: React.ReactElement;
  loaderTrigger?: boolean;
}

export const Select = forwardRef<HTMLSelectElement,React.PropsWithChildren<SelectProps>>(
  ({ children, label, hideLabel, className, intent, size, style, required, error, Loader, loaderTrigger, ...props }, ref) => {
    const selectContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role="presentation"
        aria-live="assertive"
        className={`control ${s.control}`}
      >
        <div
          ref={selectContainerRef}
          className={select({ className, intent, size })}
          data-label-hidden={hideLabel}
          style={style}
          onClick={() => {
            const selectContainer = selectContainerRef.current!;
            selectContainer.getAttribute("data-focused")
              ? selectContainerRef.current!.removeAttribute("data-focused")
              : selectContainerRef.current!.setAttribute("data-focused", "true");
          }}
          data-disabled={props.disabled}

          {...(!!props.defaultValue && { "data-selected": true })} // So the label stays up when there is a default value initially.
        >
          <Label htmlFor={props.id} {...((hideLabel || intent === "ghost") && { style: { position: "absolute", opacity: 0 } })}>
            {label}
            {required === "show" && (
              <span aria-hidden="true" className="required">
                *
              </span>
            )}
          </Label>
          <select
            {...(error && { "aria-errormessage": "formError", "aria-invalid": true })}
            {...(Loader && { "aria-live": "polite", "aria-busy": loaderTrigger })}
            ref={ref}
            required={required ? true : false}
            defaultValue=""
            {...props}

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
          >
            <option value="" hidden />
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

          {Loader && (loaderTrigger && cloneElement(Loader))}
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

export default Select;
