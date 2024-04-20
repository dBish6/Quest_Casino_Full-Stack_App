import { forwardRef, useRef } from "react";
import { Label } from "@radix-ui/react-label";

import { cva, type VariantProps } from "class-variance-authority";
import s from "./input.module.css";

const input = cva(s.input, {
  variants: {
    intent: {
      regular: null,
      icon: s.icon,
      button: s.button,
    },
    size: {
      lrg: s.lrg,
      xl: s.xl,
    },
  },
  compoundVariants: [{ size: "xl", className: s.button }],
  defaultVariants: {
    size: "xl",
  },
});

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof input> {
  label: string;
  type: string;
  name: string;
  id: string;
  Icon?: JSX.Element;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, size = "lrg", Icon, error, ...props }, ref) => {
    const inputContainerRef = useRef<HTMLDivElement>(null);

    return (
      <div role="presentation" aria-live="assertive" className={s.container}>
        <div ref={inputContainerRef} className={input({ size, className })}>
          <Label htmlFor={props.id}>
            {label}
            {props.required && (
              <span aria-hidden="true" className={s.required}>
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
          {/* {Icon && <Icon />} */}
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
