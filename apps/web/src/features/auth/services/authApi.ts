import type { SuccessResponse } from "@typings/ApiResponse";
import type {
  RegisterBodyDto,
  RegisterGoogleBodyDto,
} from "@qc/typescript/dtos/RegisterBodyDto";

import { createApi, baseQuery } from "@services/index";
// import { SET_TOKEN } from "../redux/authSlice";

import { logger } from "@qc/utils";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery("/auth"),
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (user: RegisterBodyDto) => ({
        url: `/register`,
        method: "POST",
        body: user,
      }),
    }),
    registerGoogle: builder.mutation<any, any>({
      query: (user: RegisterGoogleBodyDto) => ({
        url: `/register/google`,
        method: "POST",
        body: user,
      }),
    }),

    login: builder.mutation<any, any>({
      query: (credentials: { email: string; password: string }) => ({
        url: `/login`,
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          console.log("data", data);
          console.log("meta", meta);

          if (meta?.response?.ok) {
            console.log("Hi");
            // dispatch(SET_TOKEN(data.body.token));
          }
        } catch (error: any) {
          logger.error("authApi login onQueryStarted error:\n", error.message);
          // dispatch(SET_TOKEN(null));
        }
      },
    }),

    getUsers: builder.query<any, any>({
      query: () => ({
        url: `/user`,
        method: "GET",
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),

    getUser: builder.query<any, any>({
      query: () => ({
        url: `/users`,
        method: "GET",
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),
  }),
});

export const {
  endpoints: authEndpoints,
  reducerPath: authApiReducerPath,
  reducer: authApiReducer,
  middleware: authMiddleware,
  useRegisterMutation,
  useRegisterGoogleMutation,
  useLoginMutation,
  useGetUsersQuery,
  useGetUserQuery,
} = authApi;

export default authApi;
