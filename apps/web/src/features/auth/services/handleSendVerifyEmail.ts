import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { authEndpoints } from "./authApi";
import { ADD_TOAST } from "@redux/toast/toastSlice";

export default async function handleSendVerifyEmail(
  dispatch: ThunkDispatch<any, any, UnknownAction>
) {
  const res = dispatch(authEndpoints.sendVerifyEmail.initiate(undefined));

  try {
    const { data, error } = await res;

    if (error) {
      if (isFetchBaseQueryError(error)) {
        if (error.status === 541) {
          ADD_TOAST({
            title: "SMTP Rejected",
            message: error.data!.ERROR as string,
            intent: "error",
          });
        } else if (error.status >= 500) {
          ADD_TOAST({
            title: "Unexpected Error",
            message:
              "An unexpected server error occurred. Please try refreshing the page. If the error persists, feel free to reach out to support.",
            intent: "error",
            options: {
              link: {
                sequence: "support",
                to: "/support",
              },
            },
          });
        }
      } else {
        ADD_TOAST({
          message: `${error.message}. If the error persists, feel free to reach out to support.`,
          intent: "error",
          options: {
            link: {
              sequence: "support",
              to: "/support",
            },
          },
        });
      }
    } else if (data) {
      dispatch(
        ADD_TOAST({
          title: "Verification Pending",
          message: data.message,
          intent: "success",
          duration: 85000,
        })
      );
    }
  } catch (error: any) {
    logger.error("handleSendVerifyEmail error:\n", error.message);
  }
}
