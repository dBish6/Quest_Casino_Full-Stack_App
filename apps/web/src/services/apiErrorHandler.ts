import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { isRejected } from "@reduxjs/toolkit";
import { logger } from "@qc/utils";
import { history } from "@utils/History";

export const apiErrorHandler: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejected(action)) {
      const [reducerName, actionType] = action.type.split("/");

      console.log("action.error.message", action.error.message);

      // const payload = action.payload as any;

      // const log = () =>
      //   logger.error(
      //     `${reducerName} ${actionType} response error:\n`,
      //     payload.status
      //   );
      // switch (payload.status) {
      //   case 401:
      //     history.push("/error-401");
      //     break;
      //   case 403:
      //     history.push("/error-403");
      //     break;
      //   case 429:
      //     history.push("/error-429");
      //     break;
      //   case 500:
      //     log();
      //     history.push("/error-500");
      //     break;
      //   default:
      //     log();
      //     break;
      // }
    }

    return next(action);
  };
