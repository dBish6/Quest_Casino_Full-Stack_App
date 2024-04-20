import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import preventScroll from "@utils/preventScroll";

interface ModalTemplateProps {
  children: (props: {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
  btnText: string;
}

export default function ModalTemplate({
  children,
  btnText,
}: ModalTemplateProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    preventScroll(show);
  }, [show]);

  return (
    <Dialog.Root open={show} onOpenChange={setShow} modal>
      <Dialog.Trigger aria-pressed={show}>{btnText}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="modalOverlay" />
        {children({ show, setShow })}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
