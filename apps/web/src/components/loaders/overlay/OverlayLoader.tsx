import { Portal } from "@radix-ui/react-portal";

import Spinner from "../spinner/Spinner";

import s from "./overlayLoader.module.css";

export interface OverlayLoaderProps extends React.ComponentProps<"div"> {
  message?: string;
}

export default function OverlayLoader({
  message,
  ...props
}: OverlayLoaderProps) {
  return (
    <Portal className={s.portal}>
      <div role="status" className={s.loader} {...props}>
        <Spinner role="" intent="primary" size="xxl" />
        <span>{message ? message : "Just a moment..."}</span>
      </div>
    </Portal>
  );
}
