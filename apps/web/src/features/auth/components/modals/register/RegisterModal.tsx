import { Content } from "@radix-ui/react-dialog";
import ModalTemplate from "@components/modals/ModalTemplate";

import s from "./registerModal.module.css";

export default function RegisterModal() {
  return (
    <ModalTemplate btnText="Register">
      {({ show, setShow }) => (
        <Content>
          <button onClick={() => console.log("show", show)}>Click Me</button>
        </Content>
      )}
    </ModalTemplate>
  );
}
