import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type Variants, AnimatePresence, m } from "framer-motion";
import { Root, Trigger, Portal, Overlay } from "@radix-ui/react-dialog";

import preventScroll from "@utils/preventScroll";
import fadeInOut from "@utils/animations/fadeInOut";

import s from "./modalTemplate.module.css";

export interface ModalTemplateProps {
  children: (props: { close: () => void }) => React.ReactNode;
  query: string;
  btnText: string;
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

export default function ModalTemplate({
  children,
  query,
  btnText,
}: ModalTemplateProps) {
  const [searchParams, setSearchParams] = useSearchParams(),
    [modal, setModal] = useState(() => {
      const showModal = Boolean(searchParams.get(query));
      return { show: showModal, render: showModal };
    });

  const fadeVariant = fadeInOut({ in: 0.5, out: 1.75 });

  const handleToggle = () => {
    const toggle = !modal.show;

    if (toggle) {
      searchParams.set(query, "true");
    } else {
      searchParams.delete(query);

      setTimeout(
        () => setModal((prev) => ({ ...prev, render: false })),
        ANIMATION_DURATION
      );
    }
    preventScroll(toggle);

    setSearchParams(searchParams);
    setModal({ show: toggle, render: true });
  };

  return (
    <Root open={modal.render} onOpenChange={handleToggle} modal>
      <Trigger aria-pressed={modal.render}>{btnText}</Trigger>
      <Portal>
        <AnimatePresence>
          {modal.show && (
            <m.div
              role="presentation"
              key="backdrop"
              className={s.backdrop}
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Overlay />
              <m.div
                role="presentation"
                key="modal"
                className={s.modal}
                variants={modalPopInOut}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {children({ close: handleToggle })}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </Portal>
    </Root>
  );
}
