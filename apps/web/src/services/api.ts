import type { RootState } from "@redux/store";
// import type { CarouselContentResponseDto } from "@views/home/_components/Carousel";

// import type { HttpResponse } from "@typings/ApiResponse";

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
    baseUrl: !import.meta.env || import.meta.env.DEV ? "/api/v2" : import.meta.env.VITE_API_URL,
    ...prepareHeadersAndOptions(),
    timeout: 15000
  }),
  tagTypes: ["Notification"],

  endpoints: (builder) => ({
    // /**
    //  * Gets the carousel content by a cdn.
    //  * @request
    //  */
    // getCarouselContent: builder.query<HttpResponse<CarouselContentResponseDto>, void>({
    //   queryFn: async () => {        
    //     const res = await fetch(
    //         `https://cdn.jsdelivr.net/gh/dBish6/Quest_Casino_Full-Stack_App@${import.meta.env.DEV ? "dev" : "master"}/static/carousel/carousel.json`,
    //         { method: "GET" }
    //       ),
    //       data: CarouselContentResponseDto = await res.json();

    //     // FIXME: On error it's fucked.
    //     if (!res.ok)
    //       return {
    //         error: {
    //           data: { 
    //             ERROR: (data as any).message || "Unexpectedly failed to fetch carousel content.", 
    //             allow: true
    //           },
    //           status: res.status
    //         }
    //       };

    //     return { data: { message: "Successfully retrieved carousel content", ...data } };
    //   }
    // })
  })
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
