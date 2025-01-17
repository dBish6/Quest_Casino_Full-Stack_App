import type { Middleware, SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "@redux/store";

import { isRejected } from "@reduxjs/toolkit";
import { throttle } from "tiny-throttle";

import { logger } from "@qc/utils";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";
import { history } from "@utils/History";

import { ADD_TOAST, unexpectedErrorToast, authTokenExpiredToast } from "@redux/toast/toastSlice";
import { UPDATE_USER_CREDENTIALS } from "@authFeat/redux/authSlice";
import { attemptLogout } from "@authFeat/services/handleLogout";

export const apiErrorHandler: Middleware =
  ({ dispatch, getState }) => (next) => (action) => {
    if (isRejected(action)) {
      const [reducerName, actionType] = action.type.split("/"),
        payload = action.payload as | FetchBaseQueryError | SerializedError | undefined;

      const log = () => {
        if (payload) {
          logger.error(
            `${reducerName} ${actionType} ${(payload as SerializedError).code ? "serialization" : "response"} error:\n`,
            (payload as FetchBaseQueryError).status || (payload as SerializedError).code
          );
        }
      };

      if (isFetchBaseQueryError(payload)) {
        logger.debug("ERROR PAYLOAD:", action.payload);

        // Socket error responses send string statuses.
        switch (payload.status) {
          case 401:
          case 403:
            const authError = payload.data?.ERROR;

            if (/\b(?:Access|Refresh)\b.*\btokens?\b/i.test(authError || "")) {
              if (
                authError!.includes("expired") || authError!.includes("missing")
              ) {
                throttle(() => {
                  attemptLogout(
                    dispatch,
                    (getState() as RootState).auth.user.credentials?.username || "" // If a token error happens they're logged in, they should have a username, I guess this is just in case.
                  ).finally(() => dispatch(authTokenExpiredToast()));
                }, 1000)();
              }
            } else if (authError?.includes("must be verified")) {
              return dispatch(
                ADD_TOAST({
                  title: "Verification Required",
                  message: "You must be verified to continue. Please visit your profile to send a verification email to verify your profile.",
                  intent: "error",
                  options: {
                    link: {
                      sequence: "profile",
                      to: "/profile"
                    }
                  }
                })
              );
            } else {
              history.push(`/error-${payload.status}`)
            }

          // Access/refresh token errors for sockets happen on the initial connect, it can be found in socket.ts.
          case "unauthorized":
            history.push("/error-401");
            break;
          case "forbidden":
            history.push("/error-403");
            break;

          case 404:
          case "not found":
            if (/(?=.*\bunexpectedly\b)(?=.*\buser(?:'s)?\b)/i.test(payload.data?.ERROR || ""))
              history.push("/error-404-user");
            break;

          case 429:
            if (payload.data?.ERROR?.includes("attempts")) {
              return dispatch(UPDATE_USER_CREDENTIALS({ locked: "attempts" }));
              // This is handled at form level for all 429 attempt errors can happen (update profile, reset password).
              // return dispatch(
              //   ADD_TOAST({
              //     title: "Update Limit Reached",
              //     message: tooManyError,
              //     intent: "error"
              //   })
              // );
            } else {
              history.push("/error-429");
            }
            break;

          case 400:
          case "bad request":
            if (payload.data?.ERROR?.includes("no data", -1)) history.push("/error-500");
            break;

          default:
            log();
            // 500 errors and socket's internal error.
            if (
              !payload.data?.allow &&
              (parseInt(payload.status as any, 10) >= 500 || payload.status === "internal error")
            )
              dispatch(unexpectedErrorToast("An unexpected server error occurred."));

            break;
        }
      } else if (payload?.message) {
        log();

        const message = payload.message;
        dispatch(
          unexpectedErrorToast(`${message.length > 30 ? `${message.slice(0, 30)}...` : message}.`)
        );
      }
    }

    return next(action);
  };
