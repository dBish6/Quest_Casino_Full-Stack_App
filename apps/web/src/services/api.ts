import type { RootState } from "@redux/store";
import type Game from "@typings/Game";
import type { GameStatus } from "@qc/constants";

import type { HttpResponse } from "@typings/ApiResponse";
import type { CarouselContentResponseDto } from "@views/home/Carousel";

import { buildCreateApi, coreModule, reactHooksModule, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import allow500ErrorsTransform from "@services/allow500ErrorsTransform";
import { unexpectedErrorToast } from "@redux/toast/toastSlice";

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
              ...(csrfToken && { "x-xsrf-token": csrfToken }),
            },
          };
        })()),
    credentials: "same-origin",
  };
}

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v2",
    ...prepareHeadersAndOptions(),
    timeout: 15000
  }),
  tagTypes: ["Notification"],

  endpoints: (builder) => ({
    /**
     * Gets the carousel content by a cdn.
     * @request
     */
    getCarouselContent: builder.query<HttpResponse<CarouselContentResponseDto>, void>({
      queryFn: async () => {        
        const res = await fetch(
            `https://cdn.jsdelivr.net/gh/dBish6/Quest_Casino_Full-Stack_App@${import.meta.env.DEV ? "dev" : "master"}/static/carousel/carousel.json`,
            { method: "GET" }
          ),
          data: CarouselContentResponseDto = await res.json();

        if (!res.ok)
          return {
            error: {
              data: { 
                ERROR: (data as any).message || "Unexpectedly failed to fetch carousel content.", 
                allow: true
              },
              status: res.status,
            },
          };

        return { data: { message: "Successfully retrieved carousel content", ...data } };
      }
    }),

    /**
     * 
     * @request
     */
    getGames: builder.query<HttpResponse<{ games: Game[] }>, { status?: GameStatus } | void>({
      query: (status) => ({
        url: "/game/games",
        method: "GET",
        ...(status && { params: status })
      }),
      onQueryStarted: (_, { dispatch, queryFulfilled }) => {
        queryFulfilled.catch((error) => {
          if (isFetchBaseQueryError(error.error) && (error.error.status as number) >= 500)
            dispatch(
              unexpectedErrorToast("Unexpectedly, there was an issue retrieving our games from the server.")
            );
        })
      },
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * 
     * @request
     * // TODO: DTO if needed.
     */
    getQuests: builder.query<HttpResponse, void>({
      query: (user) => ({
        url: "/game/quests",
        method: "POST",
        body: user
      })
    }),

    /**
     * 
     * @request
     * // TODO: DTO if needed.
     */
    getBonuses: builder.query<HttpResponse, void>({
      query: (user) => ({
        url: "/game/quests",
        method: "POST",
        body: user
      })
    })
  })
});

export const {
  endpoints: apiEndpoints,
  reducerPath: apiReducerPath,
  reducer: apiReducer,
  middleware: apiMiddleware,
  // enhanceEndpoints,
  injectEndpoints,
  // Games
  useLazyGetGamesQuery,
  useLazyGetQuestsQuery,
  useLazyGetBonusesQuery
} = api;

export default api;
