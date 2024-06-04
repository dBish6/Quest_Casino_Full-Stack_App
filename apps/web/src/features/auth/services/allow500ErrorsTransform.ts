// import type { ErrorResponse } from "@typings/ApiResponse";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

/**
 * Modifies the response to neglect displaying the default error toast for status code 500,
 * allowing handling 500 errors in a self solution.
 *
 * Meant to be used in a transformResponse.
 */
export default function allow500ErrorsTransform(
  res: FetchBaseQueryError,
  meta: FetchBaseQueryMeta | undefined
) {
  if (meta?.response?.status === 500 && res.data)
    res.data = {
      ...res.data,
      allow: true,
    };

  return res;
}
