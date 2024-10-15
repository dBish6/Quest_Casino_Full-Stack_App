import type { Middleware, SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { isRejected } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";
import { history } from "@utils/History";

import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";
import { CLEAR_USER } from "@authFeat/redux/authSlice";

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
        logger.debug("ERROR PAYLOAD:", action.payload);

        if (payload.data?.allow) return next(action);

        switch (payload.status) {
          case 401:
          case "unauthorized":
            history.push("/error-401");
            break;
          case 403:
          case "forbidden":
            const error = payload.data?.ERROR as string;

            if (error?.includes("token")) {
              dispatch(CLEAR_USER());
              if (error === "Access token is expired.") {
                return dispatch(
                  ADD_TOAST({
                    title: "Session Expired",
                    message: "Your login session has expired, log in.",
                    intent: "error",
                    options: {
                      link: {
                        sequence: "log in",
                        to: `${window.location.pathname}?login=true`,
                      },
                    },
                  })
                );
              }
            }

            history.push("/error-403");
            break;
          case 404:
          case "not found":
            if (/unexpectedly|user(?:'s)?/.test(payload.data?.ERROR.toLowerCase() || "")) history.push("/error-404-user");
            break;
          case 429:
            history.push("/error-429");
            break;
          // Socket error responses send string statuses.
          case 400:
          case "bad request":
            if (payload.data?.ERROR.includes("no data", -1)) history.push("/error-500");
            break;
          default:
            log();
            if (parseInt(payload.status as any, 10) >= 500 || payload.status === "internal error")
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
