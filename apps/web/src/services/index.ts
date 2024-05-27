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
      // const token = (getState() as RootState).auth.token
      // const authToken = (getState() as any).auth.user.token;
      // if (authToken) headers.set("authorization", `Bearer ${authToken}`);

      const csrfToken = localStorage.getItem("csrf");
      if (csrfToken) headers.set("x-xsrf-token", csrfToken);

      headers.set("content-type", `application/json`);
      return headers;
    },
    credentials: "same-origin",
    timeout: 10000,
    ...options,
  });
