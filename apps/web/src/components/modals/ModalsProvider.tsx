import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import CashInModal from "./cashIn/CashInModal";
import MenuModal from "./menu/MenuModal";
import { RegisterModal, LoginModal, AddFriendsModal, NotificationsModal } from "@authFeat/components/modals";

export const Modals = [CashInModal, MenuModal, RegisterModal, LoginModal, AddFriendsModal, NotificationsModal];

export default function ModalsProvider() {
  const user = useAppSelector(selectUserCredentials);

  return Modals.map((Modal, i) => {
    const restrict = (Modal as any).restricted;

    return Modal && ((restrict === "loggedOut" ? !user : user) ? null : <Modal key={i} />);
  });
}
