import type { FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";

/**
 * Modifies the response to neglect displaying the default error toast for status code 500,
 * allowing handling 500 errors in a self solution.
 *
 * Meant to be used in a transformResponse.
 */
// TODO: Change name for socket?
export default function allow500ErrorsTransform(
  res: FetchBaseQueryError,
  meta: FetchBaseQueryMeta | undefined
) {
  if ((meta?.response?.status === 500 || (res.data as any)?.status !== "ok") && res.data)
    res.data = {
      ...res.data,
      allow: true,
    };

  return res;
}
