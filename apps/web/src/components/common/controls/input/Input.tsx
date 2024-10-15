import type { VariantProps } from "class-variance-authority";
import type { ButtonProps } from "../button/Button";
import type { IconProps } from "@components/common/Icon";

import { forwardRef, useRef, cloneElement, isValidElement } from "react";
import { Label } from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import "../input-select.css";
import s from "./input.module.css";

const input = cva("input", {
  variants: {
    intent: {
      primary: "primary",
    },
    size: {
      lrg: "lrg",
      xl: "xl",
    },
  },
  defaultVariants: {
    size: "lrg",
  },
});

export interface InputProps
  extends Omit<
      React.ComponentProps<"input">, "size" | "required" | "onChange"
    >,
    VariantProps<typeof input> {
  label: string;
  id: string;
  required?: boolean | "show";
  Button?: React.ReactElement<ButtonProps>;
  Icon?: React.ReactElement<IconProps>;
  error?: string | React.JSX.Element | boolean | null;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, intent, size, style, required, Button, Icon, error, onFocus, onBlur, ...props }, ref) => {
    const inputContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role="presentation"
        aria-live="assertive"
        className={`control ${s.container}`}
      >
        <div
          ref={inputContainerRef}
          className={`${input({ className, intent, size })}${Button ? " " + s.button : ""}${Icon ? " " + s.icon : ""}`}
          style={style}
          data-disabled={props.disabled}
        >
          {Icon && cloneElement(Icon, { "aria-hidden": true })}
          <Label htmlFor={props.id} {...(Icon && { style: { visibility: "hidden" } })}>
            {label}
            {required === "show" && (
              <span aria-hidden="true" className="required">
                *
              </span>
            )}
          </Label>
          <input
            {...(error && { "aria-errormessage": "formError", "aria-invalid": true })}
            ref={ref}
            required={required ? true : false}
            {...(Icon && { placeholder: label })}
            onFocus={(e) => {
              inputContainerRef.current!.setAttribute("data-focused", "true");
              onFocus && onFocus(e);
            }}
            onBlur={(e) => {
              inputContainerRef.current!.removeAttribute("data-focused");
              onBlur && onBlur(e);
            }}
            {...props}

            onChange={(e) => {
              const inputContainer = inputContainerRef.current!;
              !e.target.value.length
                ? inputContainer.removeAttribute("data-typing")
                : inputContainer.setAttribute("data-typing", "true");
            }}
          />
          {Button && cloneElement(Button)}
        </div>

        {error && (
          <small role="alert" id="formError" className={s.error}>
            {isValidElement(error) ? cloneElement(error) : error}
          </small>
        )}
      </div>
    );
  }
);

export default Input;
