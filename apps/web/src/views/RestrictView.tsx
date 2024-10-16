import { Outlet } from "react-router-dom";

import { history } from "@utils/History";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectUserCsrfToken } from "@authFeat/redux/authSelectors";
import { ADD_TOAST } from "@redux/toast/toastSlice";

export default function RestrictView() {
  const userToken = useAppSelector(selectUserCsrfToken),
    dispatch = useAppDispatch();

  if (!userToken) {
    dispatch(
      ADD_TOAST({
        title: "Login Session Required",
        message: "You must be logged in to access that page.",
        intent: "error",
        duration: 65000
      })
    );
    history.length 
      ? history.back({ replace: true }) : history.push("/home", { replace: true });
      
    return null;
  }

  return <Outlet />;
}
