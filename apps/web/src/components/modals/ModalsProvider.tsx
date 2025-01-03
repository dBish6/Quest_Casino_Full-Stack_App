import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import MenuModal from "@gameFeat/components/modals/menu/MenuModal";
import { RegisterModal, LoginModal, AddFriendsModal, NotificationsModal, ForgotPasswordModal, ResetPasswordModal, ViewProfileModal, ViewPaymentHistoryModal, ViewCompletedQuestsModal } from "@authFeat/components/modals";
import BankModal from "@gameFeat/components/modals/bank/BankModal";

const Modals = [MenuModal, RegisterModal, LoginModal, AddFriendsModal, NotificationsModal, ForgotPasswordModal, ResetPasswordModal, ViewProfileModal, ViewPaymentHistoryModal, ViewCompletedQuestsModal, BankModal];

export default function ModalsProvider() {
  const user = useAppSelector(selectUserCredentials);

  return Modals.map((Modal, i) => {
    const restrict = (Modal as any).restricted;

    return (
      Modal &&
      ((
        restrict === "loggedOut"
          ? !user 
          : restrict === "loggedIn"
            ? user
            : false
      ) ? null : <Modal key={i} />)
    );
  });
}
