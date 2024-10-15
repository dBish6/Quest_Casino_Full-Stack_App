import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
// import type { FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import type { ErrorResponse } from "@typings/ApiResponse";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

/**
 * Modifies the response to neglect displaying the default error toast for status code 500 and internal error 
 * status for sockets, allowing handling those errors in a self solution.
 *
 * Meant to be used in a transformResponse.
 */
export default function allow500ErrorsTransform(
  res: FetchBaseQueryError | SerializedError | ErrorResponse,
  meta: FetchBaseQueryMeta | Response | undefined
) {
  if (isFetchBaseQueryError(res)) {
    if (meta?.response?.status >= 500 || (res.data as any)?.status !== "internal error")
      res.data = {
        ...res.data!,
        allow: true
      };
  } else if (meta instanceof Response) {
    // For a custom fetch, mimics the structure of rtk's FetchBaseQueryError.
    return res = {
      data: {
        ...res,
        ...(meta.status >= 500 && { allow: true })
      },
      status: meta.status
    };
  }

  return res;
}
