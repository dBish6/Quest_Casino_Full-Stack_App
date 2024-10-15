import type { To } from "react-router-dom";
import { type LinkProps, Link } from "@components/common";
import { type ModalQueryKeyValues, ModalTrigger } from "@components/modals";

export default function displayNotificationMessage(
  message: string,
  link: {
    to: To;
    /** The part of the message that is the link. */
    sequence: string;
    queryKey?: ModalQueryKeyValues
    options?: Omit<LinkProps, "to">;
   } | undefined
) {
  if (link) {
    const parts = message.split(link.sequence),
      LinkElm = (link.queryKey ? ModalTrigger : Link) as any; 

    return (
      parts &&
      (parts[1] ? (
        <>
          {parts[0]}
          <LinkElm
            intent="primary"
            to={link.to}
            {...(link.queryKey && { queryKey: link.queryKey })}
            {...link.options}
          >
            {link.sequence}
          </LinkElm>
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
