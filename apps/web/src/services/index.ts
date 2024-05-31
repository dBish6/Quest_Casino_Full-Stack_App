import type { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import type { RootState } from "@redux/store";

import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const createApi = buildCreateApi(
  coreModule(),
  reactHooksModule({ unstable__sideEffectsInRender: true })
);

export const baseQuery = (ext: string = "", options?: FetchBaseQueryArgs) =>
  fetchBaseQuery({
    baseUrl: `/api/v2${ext}`,
    prepareHeaders: (headers, { getState }) => {
      const csrfToken = (getState() as RootState).auth.user.token.csrf;
      if (csrfToken) headers.set("x-xsrf-token", csrfToken);

      headers.set("content-type", "application/json");
      return headers;
    },
    credentials: "same-origin",
    timeout: 10000,
    ...options,
  });
