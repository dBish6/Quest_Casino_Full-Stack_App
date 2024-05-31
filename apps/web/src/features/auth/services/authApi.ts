import type { SuccessResponse } from "@typings/ApiResponse";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import {
  LoginBodyDto,
  LoginGoogleBodyDto,
} from "@qc/typescript/dtos/LoginBodyDto";

import { createApi, baseQuery } from "@services/index";

import { logger } from "@qc/utils";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery("/auth"),
  endpoints: (builder) => ({
    register: builder.mutation<SuccessResponse, RegisterBodyDto>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
        // validateStatus: (response, result) =>
        //   response.status === 200 && !result.isError,
      }),
    }),

    login: builder.mutation<SuccessResponse, LoginBodyDto>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          console.log("data", data);
          console.log("meta", meta);

          if (meta?.response?.ok) {
            // handleLoginSuccess(
            //   dispatch,
            //   data.user,
            //   meta.response.headers.get("x-xsrf-token")!
            // );
          }
        } catch (error: any) {
          logger.error("authApi login onQueryStarted error:\n", error.message);
        }
      },
    }),
    loginGoogle: builder.mutation<SuccessResponse, LoginGoogleBodyDto>({
      query: (user) => ({
        url: "/login/google",
        method: "POST",
        body: user,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          console.log("data", data);
          console.log("meta", meta);

          if (meta?.response?.ok) {
          }
          // handleLoginSuccess(
          //   dispatch,
          //   data.user,
          //   meta.response.headers.get("x-xsrf-token")!
          // );
        } catch (error: any) {
          logger.error(
            "authApi loginGoogle onQueryStarted error:\n",
            error.message
          );
        }
      },
    }),

    sendVerifyEmail: builder.mutation<SuccessResponse, undefined>({
      query: () => ({
        url: "/email-verify/send",
        method: "POST",
        validateStatus: (response, result) => response.status === 541,
      }),
    }),

    getUsers: builder.query<any, any>({
      query: () => ({
        url: "/user",
        method: "GET",
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),

    getUser: builder.query<any, any>({
      query: () => ({
        url: "/users",
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
  useLoginMutation,
  useLoginGoogleMutation,
  useSendVerifyEmailMutation,
  useGetUsersQuery,
  useGetUserQuery,
} = authApi;

export type LoginGoogleTriggerType = ReturnType<
  typeof useLoginGoogleMutation
>[0];

export default authApi;
