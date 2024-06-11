import type { DialogContentProps } from "@radix-ui/react-dialog";
import type { Variants } from "framer-motion";

import { forwardRef, useState, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import {
  Root,
  Trigger as RTrigger,
  Portal,
  Overlay,
  Content,
} from "@radix-ui/react-dialog";

import preventScroll from "@utils/preventScroll";
import { fadeInOut } from "@utils/animations";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { ADD_TOAST } from "@redux/toast/toastSlice";

import { ScrollArea } from "@components/scrollArea";

import "./modalTemplate.css";

export interface ModalTemplateProps
  extends Omit<DialogContentProps, "children" | "onInteractOutside"> {
  children: (props: { close: () => void }) => React.ReactNode;
  queryKey: string;
  width: React.CSSProperties["maxWidth"];
  Trigger: (() => React.ReactElement) | null;
}

const ANIMATION_DURATION = 1100,
  modalPopInOut: Variants = {
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        y: { type: "spring", stiffness: 50 },
        opacity: { ease: "easeInOut", duration: 1 },
      },
    },
    hidden: {
      y: "-200%",
      opacity: 0,
      transition: {
        y: { type: "tween", duration: ANIMATION_DURATION / 1000 },
        opacity: { ease: "easeOut", duration: 0.5 },
      },
    },
  };

const ModalTemplate = forwardRef<HTMLDivElement, ModalTemplateProps>(
  ({ children, className, style, queryKey, width, Trigger, ...props }, ref) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [modal, setModal] = useState({ show: false, render: false }),
      fadeVariant = fadeInOut({ in: 0.5, out: 1.75 });

    const dispatch = useAppDispatch(),
      user = useAppSelector(selectUserCredentials);

    const handleToggle = () => {
      const toggle = !modal.show;
      if (toggle) searchParams.set(queryKey, "true");
      else searchParams.delete(queryKey);

      preventScroll(toggle);
      setSearchParams(searchParams);
    };

    useLayoutEffect(() => {
      const incomingQuery = searchParams.get(queryKey);
      if (incomingQuery === "register" && user) {
        dispatch(
          ADD_TOAST({
            message:
              "You're already logged in, you cannot access this content.",
            intent: "error",
            duration: 65000,
          })
        );
      } else {
        let timeout: NodeJS.Timeout;
        const showModal = Boolean(incomingQuery);
        if (!showModal) {
          timeout = setTimeout(
            () => setModal((prev) => ({ ...prev, render: false })),
            ANIMATION_DURATION
          );
        }
        setModal({ show: showModal, render: true });

        return () => timeout && clearTimeout(timeout);
      }
    }, [searchParams]);

    return (
      <Root open={modal.render} onOpenChange={handleToggle} modal>
        {Trigger && (
          <RTrigger aria-pressed={modal.render}>
            <Trigger />
          </RTrigger>
        )}
        <Portal>
          <AnimatePresence>
            {modal.show && (
              <m.div
                role="presentation"
                key="backdrop"
                className="modalBackdrop"
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Overlay />
                <m.div
                  role="presentation"
                  key="modal"
                  className="modalContainer"
                  style={{ maxWidth: width }}
                  variants={modalPopInOut}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Content
                    ref={ref}
                    onInteractOutside={(e) => e.preventDefault()}
                    {...props}
                  >
                    <ScrollArea
                      className={`modal ${className ? " " + className : ""}`}
                      orientation="vertical"
                    >
                      {children({ close: handleToggle })}
                    </ScrollArea>
                  </Content>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </Portal>
      </Root>
    );
  }
);

export default ModalTemplate;
