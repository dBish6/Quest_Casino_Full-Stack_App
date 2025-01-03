import type { GameStatus, TransactionType } from "@qc/constants";

import type { HttpResponse } from "@typings/ApiResponse";
import type { GetGamesResponseDto } from "@qc/typescript/dtos/GetGamesDto";
import type { GetQuestsResponseDto, GetUserQuestsProgressResponseDto } from "@qc/typescript/dtos/GetQuestsDto";
import type DepositResponseDto from "@gameFeat/dtos/DepositResponseDto";
import type { PaymentHistoryResponseDto } from "@qc/typescript/dtos/PaymentHistoryDto";

// import { logger } from "@qc/utils";
// import { history } from "@utils/History";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { injectEndpoints } from "@services/api";
import allow500ErrorsTransform from "@services/allow500ErrorsTransform";

import { UPDATE_USER_CREDENTIALS } from "@authFeat/redux/authSlice";
import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";

// const socket = getSocketInstance("");

const gameApi = injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /**
     * Gets game content for navigation.
     * @request
     */
    getGames: builder.query<HttpResponse<GetGamesResponseDto>, { status?: GameStatus } | void>({
      query: (status) => ({
        url: "/games",
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
     */
    getQuests: builder.query<
      HttpResponse<GetQuestsResponseDto | GetUserQuestsProgressResponseDto>,
      { username: string } | void
    >({
      query: (param) => ({
        url: "/games/quests",
        method: "GET",
        ...(param?.username && { params: { username: param.username } })
      }),
      onQueryStarted: (_, { dispatch, queryFulfilled }) => {
        queryFulfilled.catch((error) => {
          if (isFetchBaseQueryError(error.error) && (error.error.status as number) === 404)
            dispatch(
              ADD_TOAST({
                title: "Quests Not Found",
                message: error.error.data!.ERROR,
                intent: "error",
                duration: 6500
              })
            );
        });
      }
    }),

    /**
     * 
     * @request
     * // TODO: DTO if needed.
     */
    getBonuses: builder.query<HttpResponse, void>({
      query: (user) => ({
        url: "/games/quests",
        method: "GET"
      })
    }),

    /**
     * Increases balance and adds to payment history.
     * @request
     */
    transaction: builder.mutation<
      HttpResponse<DepositResponseDto>,
      { type: TransactionType; body: { amount: number } }
    >({
      query: ({ type, body }) => ({
        url: "/payment/transaction",
        method: "POST",
        body,
        params: { type }
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled;

        if (meta?.response?.ok) {
          dispatch(UPDATE_USER_CREDENTIALS(data.user));
        }
      },
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * Gets the user's deposit and withdraw history.
     * @request
     */
    getPaymentHistory: builder.query<HttpResponse<PaymentHistoryResponseDto>, void>({
      query: () => ({
        url: "/payment/history",
        method: "GET"
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    })
  })
});

export const {
  endpoints: gameEndpoints,
  useLazyGetGamesQuery,
  useLazyGetQuestsQuery,
  useLazyGetBonusesQuery,
  useTransactionMutation,
  useLazyGetPaymentHistoryQuery
} = gameApi;

export default gameApi;
