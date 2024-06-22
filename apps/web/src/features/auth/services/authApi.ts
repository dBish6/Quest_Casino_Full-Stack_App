import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type {
  ApiResponse,
  SuccessResponse,
  // ErrorResponse,
} from "@typings/ApiResponse";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import {
  LoginBodyDto,
  LoginGoogleBodyDto,
} from "@qc/typescript/dtos/LoginBodyDto";

import { createApi, baseQuery } from "@services/index";
import {
  SET_USER_CREDENTIALS,
  INITIALIZE_SESSION,
} from "@authFeat/redux/authSlice";
import { ADD_TOAST } from "@redux/toast/toastSlice";

import { logger } from "@qc/utils";
// import { history } from "@utils/History";
import allow500ErrorsTransform from "./allow500ErrorsTransform";
import handleSendVerifyEmail from "./handleSendVerifyEmail";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery("/auth"),
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse, RegisterBodyDto>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user,
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta),
    }),

    login: builder.mutation<ApiResponse, LoginBodyDto>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok) {
            handleLoginSuccess(
              dispatch,
              (data as SuccessResponse).user,
              meta.response.headers.get("x-xsrf-token")!
            );
          }
        } catch (error: any) {
          logger.error("authApi login onQueryStarted error:\n", error.message);
        }
      },
    }),
    loginGoogle: builder.mutation<ApiResponse, LoginGoogleBodyDto>({
      query: (user) => ({
        url: "/login/google",
        method: "POST",
        body: user,
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok)
            handleLoginSuccess(
              dispatch,
              (data as SuccessResponse).user,
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

    emailVerify: builder.mutation<ApiResponse, undefined>({
      query: () => ({
        url: "/email-verify",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled,
          res = meta?.response;

        if (res?.ok) {
          const successData = data as SuccessResponse;

          dispatch(SET_USER_CREDENTIALS(successData.user));
          dispatch(
            ADD_TOAST({
              message: successData.message,
              intent: "success",
              duration: 65000,
            })
          );
        } else if (res?.status === 404) {
          dispatch(
            ADD_TOAST({
              title: "Unexpected Error",
              message:
                "We couldn't find your profile on our server. If the error persists, feel free to reach out to support.",
              intent: "error",
              options: {
                link: {
                  sequence: "support",
                  to: "/support",
                },
              },
            })
          );
        }
      },
    }),
    sendVerifyEmail: builder.mutation<ApiResponse, undefined>({
      query: () => ({
        url: "/email-verify/send",
        method: "POST",
      }),
    }),

    getUsers: builder.query<ApiResponse, undefined>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),

    getUser: builder.query<ApiResponse, undefined>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),
  }),
});

function handleLoginSuccess(
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  user: UserCredentials,
  token: string
) {
  dispatch(INITIALIZE_SESSION({ credentials: user, csrf: token }));

  const params = new URLSearchParams(window.location.search);
  console.log("params", params);
  // Removes the google params.
  for (const key of Array.from(params.keys())) {
    console.log("key", key);
    if (!["login", "register"].includes(key)) {
      console.log("removed", key);
      params.delete(key);
    }
  }
  window.history.replaceState({}, document.title, params.toString());

  if (!params.has("register")) {
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
}

export const {
  endpoints: authEndpoints,
  reducerPath: authApiReducerPath,
  reducer: authApiReducer,
  middleware: authMiddleware,
  useRegisterMutation,
  useLoginMutation,
  useLoginGoogleMutation,
  useEmailVerifyMutation,
  useSendVerifyEmailMutation,
  useGetUsersQuery,
  useGetUserQuery,
} = authApi;

export default authApi;

export type LoginGoogleTriggerType = ReturnType<
  typeof useLoginGoogleMutation
>[0];
