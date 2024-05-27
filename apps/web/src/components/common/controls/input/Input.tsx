import type { VariantProps } from "class-variance-authority";
import type { ButtonProps } from "../button/Button";

import { forwardRef, useRef } from "react";
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
      React.ComponentProps<"input">,
      "size" | "onFocus" | "onBlur" | "onChange"
    >,
    VariantProps<typeof input> {
  label: string;
  name: string;
  id: string;
  Button?: () => React.ReactElement<ButtonProps>;
  error?: string | null;
}

// prettier-ignore
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, intent, size, style, Button, error, ...props }, ref) => {
    const inputContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role="presentation"
        aria-live="assertive"
        className={`control ${s.container}`}
      >
        <div
          ref={inputContainerRef}
          className={`${input({ className, intent, size })}${Button ? " " + s.button : ""}`}
          style={style}
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
          <input
            {...(error && { "aria-errormessage": "formError", "aria-invalid": true })}
            ref={ref}
            onFocus={() =>
              inputContainerRef.current!.setAttribute("data-focused", "true")
            }
            onBlur={() => inputContainerRef.current!.removeAttribute("data-focused")}
            onChange={(e) => {
              const inputContainer = inputContainerRef.current!;
              !e.target.value.length
                ? inputContainer.removeAttribute("data-typing")
                : inputContainer.setAttribute("data-typing", "true");
            }}
            {...props}
          />
          {Button && <Button />}
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
