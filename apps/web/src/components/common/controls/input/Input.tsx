import { type ButtonProps } from "../button/Button";

import { forwardRef, useRef } from "react";
import { Label } from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

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
    size: "xl",
  },
});

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof input> {
  label: string;
  name: string;
  id: string;
  Button?: () => React.ReactElement<ButtonProps>;
  error?: string;
}

// prettier-ignore
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, intent, size = "lrg", style, Button, error, ...props }, ref) => {
    const inputContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        role="presentation"
        aria-live="assertive"
        className={`control ${s.container}`}
        style={style}
      >
        <div
          ref={inputContainerRef}
          className={`${input({ className, intent, size })}${Button ? " " + s.button : ""}`}
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
            aria-describedby="formError"
            {...(error && { "aria-invalid": true })}
            ref={ref}
            onFocus={() =>
              inputContainerRef.current!.setAttribute("focused", "true")
            }
            onBlur={() => inputContainerRef.current!.removeAttribute("focused")}
            onChange={(e) => {
              const inputContainer = inputContainerRef.current!;
              !e.target.value.length
                ? inputContainer.removeAttribute("typing")
                : inputContainer.setAttribute("typing", "true");
            }}
            {...props}
          />
          {Button && <Button />}
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
