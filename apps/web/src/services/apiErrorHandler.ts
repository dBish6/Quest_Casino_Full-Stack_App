import type { Middleware, SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { isRejected } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";
import { history } from "@utils/History";

// import handleAccessTokenError from "@authFeat/services/handleAccessTokenError";
import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";
import { UPDATE_USER_CREDENTIALS, CLEAR_USER } from '@authFeat/redux/authSlice';

export const apiErrorHandler: Middleware =
  ({ dispatch }) => (next) => (action) => {
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
      // if (isFetchBaseQueryError(payload) && typeof window !== "undefined") {
        logger.debug("ERROR PAYLOAD:", action.payload);

        // if (payload.data?.allow) return next(action);

        switch (payload.status) {
          case 401:
          case "unauthorized":
            history.push("/error-401");
            break;

          case 403:
          case "forbidden":
            const biddenError = payload.data?.ERROR;

            // FIXME: This doesn't work for sockets, need to figure out how to send a object for a middleware.
            // if (biddenError?.includes("token")) {
            //   dispatch(CLEAR_USER());
            //   if (biddenError === "Access token is expired.") {
                // return dispatch(
                //   ADD_TOAST({
                //     title: "Session Expired",
                //     message: "Your login session has expired, log in.",
                //     intent: "error",
                //     options: {
                //       link: {
                //         sequence: "log in",
                //         to: `${window.location.pathname}?login=true`
                //       }
                //     }
                //   })
                // );
              // }
            /**
             * This will rarely happen since most browsers delete the Access token's cookie (session cookie) when it's expired 
             * but some browsers may not delete it by default so this is just in case.
             */
            if (biddenError === "Access token is expired.") {
              // dispatch(unexpectedAccessTokenExpiredToast());
              // TODO: We won't do this, we'll send a request for a refresh here (maybe that is unsafe, so they'll probably have to log in...)
              // we won't have the user on a manual request refresh. (just try to refresh manually for both since you do it for the threshold on the back-end anyway, so just verify the csrf token on a manual refresh)
            } else if (biddenError?.includes("must be verified")) {
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
            }

            history.push("/error-403");
            break;

          case 404:
          case "not found":
            // if (/unexpectedly|user(?:'s)?/.test(payload.data?.ERROR?.toLowerCase() || "")) history.push("/error-404-user");
            if (/\bunexpectedly\b|\buser(?:'s)?\b/.test(payload.data?.ERROR?.toLowerCase() || "")) history.push("/error-404-user");
            break;

          case 429:
            const tooManyError = payload.data?.ERROR;

            // if (tooManyError?.startsWith("Profile update limit")) {
            //   return dispatch(UPDATE_USER_CREDENTIALS({ locked: "attempts" }));
            //   // This is handled at form level for all 429 attempt errors can happen (update profile, reset password).
            //   // return dispatch(
            //   //   ADD_TOAST({
            //   //     title: "Update Limit Reached",
            //   //     message: tooManyError,
            //   //     intent: "error"
            //   //   })
            //   // );
            // }

            // if (!tooManyError?.includes("attempts")) history.push("/error-429");

            if (tooManyError?.includes("attempts")) {
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

          // case 500:
          //   log();
          //   dispatch(unexpectedErrorToast("An unexpected server error occurred."));
          //   break;

          // Socket error responses send string statuses.
          case 400:
          case "bad request":
            if (payload.data?.ERROR?.includes("no data", -1)) history.push("/error-500");
            break;

          // case "internal error":
          //   log();
          //   // TODO: Could do the same as 500?
          //   history.push("/error-500");
          //   break;

          default:
            log();

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
