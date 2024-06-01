import type { SuccessResponse } from "@typings/ApiResponse";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import {
  LoginBodyDto,
  LoginGoogleBodyDto,
} from "@qc/typescript/dtos/LoginBodyDto";

import { createApi, baseQuery } from "@services/index";
import {
  SET_USER_CREDENTIALS,
  SET_CSRF_TOKEN,
} from "@authFeat/redux/authSlice";
import { ADD_TOAST } from "@redux/toast/toastSlice";

import { logger } from "@qc/utils";
import handleSendVerifyEmail from "./handleSendVerifyEmail";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import UserCredentials from "@qc/typescript/typings/UserCredentials";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery("/auth"),
  endpoints: (builder) => ({
    register: builder.mutation<SuccessResponse, RegisterBodyDto>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
        // TODO: ?
        // validateStatus: (response, result) =>
        //   response.status === 500,
      }),
    }),

    login: builder.mutation<SuccessResponse, LoginBodyDto>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok) {
            handleLoginSuccess(
              dispatch,
              data.user,
              meta.response.headers.get("x-xsrf-token")!
            );
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
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok)
            handleLoginSuccess(
              dispatch,
              data.user,
              meta.response.headers.get("x-xsrf-token")!
            );
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
        // TODO:
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

function handleLoginSuccess(
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  user: UserCredentials,
  token: string
) {
  dispatch(SET_USER_CREDENTIALS(user));
  dispatch(SET_CSRF_TOKEN(token));

  if (!user.email_verified) {
    dispatch(
      ADD_TOAST({
        title: "Welcome Issue",
        message: `Welcome back ${user.username}! We've noticed that your profile hasn't been verified yet, please try to resend the verification email.`,
        intent: "success",
        options: {
          button: {
            sequence: "resend the verification email.",
            onClick: () => handleSendVerifyEmail(dispatch),
          },
        },
      })
    );
  } else {
    dispatch(
      ADD_TOAST({
        title: "Welcome",
        message: `Welcome back ${user.username}!`,
        intent: "success",
        duration: 65000,
      })
    );
  }
}

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
