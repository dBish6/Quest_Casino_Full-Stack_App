import type { ToastProps as RadixToastProps } from "@radix-ui/react-toast";
import type { VariantProps } from "class-variance-authority";

import {
  Provider,
  Root,
  Title,
  Description,
  Action,
  Close,
  Viewport,
} from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectToasts } from "@redux/toast/toastSelectors";
import { REMOVE_TOAST } from "@redux/toast/toastSlice";

import { Button } from "@components/common/controls";
import { Icon } from "@components/common/icon";

import s from "./toast.module.css";

const defaultTitles = {
  success: "Success!",
  error: "Error",
  info: "Info",
};

const toast = cva(s.toast, {
  variants: {
    intent: {
      success: s.success,
      error: s.error,
      info: s.info,
    },
    // size: {
    //   sm: s.sm,
    //   md: s.md,
    //   lrg: s.lrg,
    //   xl: s.xl,
    // },
    defaultVariants: {
      intent: "info",
    },
  },
});

export interface ToastProps
  extends RadixToastProps,
    VariantProps<typeof toast> {
  title?: string;
  message: string;
  close: () => void;
  intent: "success" | "error" | "info";
}

export default function Toast({
  title,
  message,
  close,
  intent,
  className,
  ...props
}: ToastProps) {
  return (
    <Root
      className={toast({ className, intent })}
      open
      onOpenChange={close}
      {...props}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 402 12.775"
          preserveAspectRatio="xMidYMin meet"
          className={s.borderTop}
        >
          <path d="M.025 12.775A12.33 12.33 0 0 1 0 12 12 12 0 0 1 12 0h378a12 12 0 0 1 12 12c0 .253-.008.509-.024.76A10.531 10.531 0 0 0 391.5 3h-381A10.525 10.525 0 0 0 .025 12.775Z" />
        </svg>
      </div>
      <Close asChild>
        <Button intent="exit" size="xl" />
      </Close>

      <div>
        {intent === "success" ? (
          <Icon id="check-mark-24" />
        ) : intent === "error" ? (
          <Icon id="warning-24" />
        ) : (
          <Icon id="info-24" />
        )}{" "}
      </div>
      <Title asChild>
        <h3>{title ?? defaultTitles[intent]}</h3>
      </Title>
      <Description asChild>
        <p>{message}</p>
      </Description>
    </Root>
  );
}

export function ToastsProvider() {
  const toasts = useAppSelector(selectToasts),
    dispatch = useAppDispatch();

  console.log("toasts", toasts);

  return (
    <Provider duration={5000000000000000}>
      {toasts.length > 0 &&
        toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            close={() => dispatch(REMOVE_TOAST({ id: toast.id }))}
            intent={toast.intent}
          />
        ))}
      <Viewport className={s.viewport} />
    </Provider>
  );
}
