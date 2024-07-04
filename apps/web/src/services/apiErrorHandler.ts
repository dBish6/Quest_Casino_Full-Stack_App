import type {
  Middleware,
  MiddlewareAPI,
  SerializedError,
} from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { isRejected } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";
import { history } from "@utils/History";

import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";
import { CLEAR_USER } from "@authFeat/redux/authSlice";

export const apiErrorHandler: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejected(action)) {
      const [reducerName, actionType] = action.type.split("/"),
        payload = action.payload as | FetchBaseQueryError | SerializedError | undefined; // prettier-ignore

      const log = () => {
        if (payload) {
          logger.error(
            `${reducerName} ${actionType} ${(payload as SerializedError).code ? "serialization" : "response"} error:\n`,
            (payload as FetchBaseQueryError).status || (payload as SerializedError).code // prettier-ignore
          );
        }
      };

      if (isFetchBaseQueryError(payload)) {
        switch (payload.status) {
          case 401:
            history.push("/error-401");
            break;
          case 403:
            const error = payload.data?.ERROR as string | undefined;

            if (error?.includes("token")) {
              api.dispatch(CLEAR_USER());
              if (error === "Access token is expired.") {
                return api.dispatch(
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
          case 429:
            history.push("/error-429");
            break;
          case 500:
            log();
            if (!payload.data?.allow)
              // api.dispatch(
              //   ADD_TOAST({
              //     title: "Unexpected Error",
              //     message:
              //       "An unexpected server error occurred. Please try refreshing the page. If the error persists, feel free to reach out to support.",
              //     intent: "error",
              //     options: {
              //       link: {
              //         sequence: "support",
              //         to: "/support",
              //       },
              //     },
              //   })
              // );
              api.dispatch(
                unexpectedErrorToast("An unexpected server error occurred.")
              );
            break;
          default:
            log();
            break;
        }
      } else if (payload?.message) {
        log();
        // api.dispatch(
        //   ADD_TOAST({
        //     title: "Unexpected Error",
        //     message: `${payload.message}. If the error persists, feel free to reach out to support.`,
        //     intent: "error",
        //     options: {
        //       link: {
        //         sequence: "support",
        //         to: "/support",
        //       },
        //     },
        //   })
        // );
        const message = payload.message;
        api.dispatch(
          unexpectedErrorToast(
            `${message.length > 30 ? `${message.slice(0, 30)}...` : message}.`
          )
        );
      }
    }

    return next(action);
  };
