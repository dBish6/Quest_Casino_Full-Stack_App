import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { authEndpoints } from "./authApi";
import { ADD_TOAST } from "@redux/toast/toastSlice";

export default async function handleSendVerifyEmail(
  dispatch: ThunkDispatch<any, any, UnknownAction>
) {
  const button = document.getElementById("toastBtn");
  if (!button) return logger.error("Button with ID 'toastBtn' not found.");

  const initialText = button?.innerText;
  button.setAttribute("aria-live", "polite");
  button.setAttribute("disabled", "");
  button.innerText = "Loading...";

  try {
    console.log("hello");
    const res = dispatch(authEndpoints.sendVerifyEmail.initiate(undefined));

    const { data, error } = await res;

    if (error && isFetchBaseQueryError(error)) {
      if (error.status === 541) {
        dispatch(
          ADD_TOAST({
            title: "SMTP Rejected",
            message: error.data!.ERROR as string,
            intent: "error",
          })
        );
      }
    } else if (data && data.message?.includes("successfully", -1)) {
      dispatch(
        ADD_TOAST({
          title: "Verification Pending",
          message: data.message,
          intent: "success",
        })
      );
    }
  } catch (error: any) {
    logger.error("handleSendVerifyEmail error:\n", error.message);
  } finally {
    button.removeAttribute("disabled");
    button.innerText = initialText;
  }
}
