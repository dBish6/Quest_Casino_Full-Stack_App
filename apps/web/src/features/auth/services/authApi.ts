import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { UserCredentials, FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import type { HttpResponse, SocketResponse } from "@typings/ApiResponse";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { LoginBodyDto, LoginGoogleBodyDto } from "@qc/typescript/dtos/LoginBodyDto";
import type ManageFriendDto from "@qc/typescript/dtos/ManageFriendDto";

import { getSocketInstance, emitAsPromise } from "@services/socket";
import { createApi, baseQuery } from "@services/index";
import { UPDATE_USER_CREDENTIALS, INITIALIZE_SESSION, CLEAR_USER } from "@authFeat/redux/authSlice";
import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";

import { logger } from "@qc/utils";
// import { history } from "@utils/History";
import allow500ErrorsTransform from "../../../services/allow500ErrorsTransform";
import handleSendVerifyEmail from "./handleSendVerifyEmail";

const socket = getSocketInstance("auth");

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery("/auth"),
  endpoints: (builder) => ({
    // <------------------------------------HTTP------------------------------------>
    register: builder.mutation<HttpResponse, RegisterBodyDto>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta),
    }),

    login: builder.mutation<HttpResponse<{ user: UserCredentials }>, LoginBodyDto>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled;

        if (meta?.response?.ok)
          handleLoginSuccess(
            dispatch,
            data.user,
            meta.response.headers.get("x-xsrf-token")!
          );
      },
    }),
    loginGoogle: builder.mutation<HttpResponse<{ user: UserCredentials }>, LoginGoogleBodyDto>({
      query: (credentials) => ({
        url: "/login/google",
        method: "POST",
        body: credentials
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled;

        if (meta?.response?.ok)
          handleLoginSuccess(
            dispatch,
            data.user,
            meta.response.headers.get("x-xsrf-token")!
          );
      },
    }),

    emailVerify: builder.mutation<HttpResponse<{ user: UserCredentials }>,undefined>({
      query: () => ({
        url: "/email-verify",
        method: "POST"
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled,
          res = meta?.response;

        if (res?.ok) {
          dispatch(UPDATE_USER_CREDENTIALS(data.user));
          dispatch(
            ADD_TOAST({
              message: data.message,
              intent: "success",
              duration: 65000
            })
          );
        } else if (res?.status === 404) {
          dispatch(
            unexpectedErrorToast("We couldn't find your profile on our server.")
          );
        }
      },
    }),
    sendVerifyEmail: builder.mutation<HttpResponse, undefined>({
      query: () => ({
        url: "/email-verify/send",
        method: "POST"
      }),
    }),

    getUser: builder.query<HttpResponse, undefined>({
      query: () => ({
        url: "/users",
        method: "GET"
      }),
    }),

    getUsers: builder.query<HttpResponse, undefined>({
      query: () => ({
        url: "/user",
        method: "GET"
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { meta } = await queryFulfilled;
        if (meta?.response?.status === 404)
          dispatch(
            unexpectedErrorToast("We couldn't find your profile on our server.")
          );
      },
    }),

    logout: builder.mutation<HttpResponse, { username: string }>({
      query: (username) => ({
        url: "/logout",
        method: "POST",
        body: username
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        // FIXME: OState token? Need to refresh or something?
        const { meta } = await queryFulfilled;

        if (meta?.response?.ok) {
          dispatch(CLEAR_USER())
          alert("User login session timed out.")
        }
      },
    }),

    // <------------------------------------Socket------------------------------------>
    manageFriends: builder.mutation<SocketResponse<{ friends: FriendCredentials[] }>, ManageFriendDto>({
      queryFn: async (data) => emitAsPromise(socket)("manage_friends", data),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        if (data.friends) dispatch(UPDATE_USER_CREDENTIALS({ friends: data.friends }))
      },
    }),
  }),
});

function handleLoginSuccess(
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  user: UserCredentials,
  token: string
) {
  try {
    dispatch(INITIALIZE_SESSION({ credentials: user, csrf: token }));

    const params = new URLSearchParams(window.location.search);
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
            message: `Welcome back ${user.username}! We've noticed that your profile hasn't been verified yet, send verification email.`,
            intent: "success",
            options: {
              button: {
                sequence: "send verification email.",
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
  } catch (error: any) {
    logger.error("authApi handleLoginSuccess error:\n", error.message);
    dispatch(
      unexpectedErrorToast(
        "An unexpected error occurred while initializing your login session."
      )
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
  useEmailVerifyMutation,
  // useSendVerifyEmailMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useLogoutMutation,
  useManageFriendsMutation
} = authApi;

export default authApi;

export type LoginGoogleTriggerType = ReturnType<typeof useLoginGoogleMutation>[0];
