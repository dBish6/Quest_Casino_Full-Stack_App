import type { RootState } from "@redux/store";

import { buildCreateApi, coreModule, reactHooksModule, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const createApi = buildCreateApi(
  coreModule(),
  reactHooksModule({ unstable__sideEffectsInRender: true })
);

export function prepareHeadersAndOptions(custom?: { state: RootState }): Record<string, any> {
  return {
    ...(!custom
      ? {
          prepareHeaders: (headers: Headers, { getState }: { getState: () => RootState }) => {
            const csrfToken = getState().auth.user.token.csrf;
            if (csrfToken) headers.set("x-xsrf-token", csrfToken);

            headers.set("Content-Type", "application/json");
            return headers;
          },
        }
      : (() => {
          const csrfToken = custom.state.auth.user.token.csrf;
          return {
            headers: {
              "Content-Type": "application/json",
              ...(csrfToken && { "x-xsrf-token": csrfToken })
            }
          };
        })()),
    credentials: "same-origin"
  };
}

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env?.VITE_API_URL,
    ...prepareHeadersAndOptions(),
    timeout: 15000
  }),
  tagTypes: ["Notification"],

  endpoints: () => ({})
});

export const {
  endpoints: apiEndpoints,
  reducerPath: apiReducerPath,
  reducer: apiReducer,
  middleware: apiMiddleware,
  // enhanceEndpoints,
  injectEndpoints
} = api;

export default api;
