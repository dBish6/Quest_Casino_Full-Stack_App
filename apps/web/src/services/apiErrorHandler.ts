import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { isRejected } from "@reduxjs/toolkit";
import { logger } from "@qc/utils";
import { history } from "@utils/History";
import { ADD_TOAST } from "@redux/toast/toastSlice";

export const apiErrorHandler: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejected(action)) {
      const [reducerName, actionType] = action.type.split("/");

      if (import.meta.env.MODE === "development")
        console.error("action.error", action.error);

      const payload = action.payload as any;

      // const log = () =>
      //   logger.error(
      //     `${reducerName} ${actionType} response error:\n`,
      //     payload.status
      //   );
      switch (payload.status) {
        case 401:
          history.push("/error-401");
          break;
        case 403:
          if (payload.data.ERROR === "Access token is expired.")
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

          history.push("/error-403");
          break;
        case 429:
          history.push("/error-429");
          break;
        //       // FIXME:
        //     case 500:
        //       log();
        //       history.push("/error-500");
        //       break;
        //     default:
        //       log();
        //       break;
      }
    }

    return next(action);
  };
