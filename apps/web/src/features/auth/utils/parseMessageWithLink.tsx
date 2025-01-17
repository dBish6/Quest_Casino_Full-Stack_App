import type { To } from "react-router-dom";
import { type LinkProps, Link } from "@components/common";
import { type ModalQueryKeyValues, ModalTrigger } from "@components/modals";
import { Button } from "@components/common/controls";

export default function parseMessageWithLink(
  message: string,
  link?: {
    to?: To;
    /** The part of the message that is the link. */
    sequence: string;
    queryKey?: ModalQueryKeyValues
    options?: Omit<LinkProps, "to"> & { button?: boolean };
   }
) {
  if (link) {
    const parts = message.split(link.sequence),
      Element = (link.queryKey ? ModalTrigger : Link) as any;

    return (
      parts &&
      (parts[1] ? (
        <>
          {parts[0]}
          <Element
            {...(link.options?.button
              ? { asChild: true, to: "" }
              : { to: link.to || "" })}
            intent="primary"
            {...(link.queryKey && { query: { param: link.queryKey } })}
            {...link.options}
          >
            {link.options?.button ? (
              <Button id="parsedBtn">{link.sequence}</Button>
            ) : (
              link.sequence
            )}
          </Element>
          {parts[1]}
        </>
      ) : (
        message
      ))
    );
  } else {
    return message;
  }
}
