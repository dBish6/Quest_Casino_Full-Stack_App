import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import type { FetchBaseQueryMeta, FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import type { PatchCollection } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import type { RootState } from "@redux/store";
import type { UserCredentials, FriendCredentials, MinUserCredentials } from "@qc/typescript/typings/UserCredentials";

import type { HttpResponse, SocketResponse } from "@typings/ApiResponse";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { LoginBodyDto, LoginGoogleBodyDto } from "@qc/typescript/dtos/LoginBodyDto";
import type { ManageFriendRoomDto, ManageFriendRequestDto } from "@qc/typescript/dtos/ManageFriendDto";
import type { GetNotificationsResponseDto, DeleteNotificationsBodyDto, Notification } from "@qc/typescript/dtos/NotificationsDto"

import { AuthEvent } from "@qc/constants";

import { type ActivityStatuses, logger } from "@qc/utils";
import { history } from "@utils/History";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { createApi, baseQuery } from "@services/index";
import { getSocketInstance, emitAsPromise } from "@services/socket";
import allow500ErrorsTransform from "@services/allow500ErrorsTransform";
import handleSendVerifyEmail from "./handleSendVerifyEmail";
import { UPDATE_USER_CREDENTIALS, INITIALIZE_SESSION, CLEAR_USER } from "@authFeat/redux/authSlice";
import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";

const socket = getSocketInstance("auth");
export const authSocketListeners = {
  friendsUpdate: "friendsUpdate",
  friendActivity: "friendActivity",
  newNotification: "newNotification",
} as const;

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery("/auth"),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    /**
     * 
     * @request
     */
    register: builder.mutation<HttpResponse, RegisterBodyDto>({
      query: (user) => ({
        url: "/register",
        method: "POST",
        body: user
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * 
     * @request
     */
    login: builder.mutation<HttpResponse<{ user: UserCredentials }>, LoginBodyDto>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials
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
          if (isFetchBaseQueryError(error.error)) {
            if (error.error.status === 404)
              dispatch(
                unexpectedErrorToast(
                  "We couldn't find your profile on our server."
                )
              );
          }
        }
      },
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),
    /**
     * 
     * @request
     */
    loginGoogle: builder.mutation<HttpResponse<{ user: UserCredentials }>, LoginGoogleBodyDto>({
      query: (credentials) => ({
        url: "/login/google",
        method: "POST",
        body: credentials
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled;

        if (meta?.response?.ok)
          handleLoginSuccess(
            dispatch,
            data.user,
            meta.response.headers.get("x-xsrf-token")!
          );
      },
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * 
     * @request
     */
    emailVerify: builder.mutation<HttpResponse<{ user: UserCredentials }>, void>({
      query: () => ({
        url: "/email-verify",
        method: "POST"
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok) {
            dispatch(UPDATE_USER_CREDENTIALS(data.user));
            dispatch(
              ADD_TOAST({
                message: data.message,
                intent: "success",
                duration: 65000,
              })
            );
          }
        } catch (error: any) {
          if (isFetchBaseQueryError(error.error)) {
            if (error.error.status === 404)
              dispatch(
                unexpectedErrorToast(
                  "We couldn't find your profile on our server."
                )
              );
          }
        }
      }
    }),
    /**
     * 
     * @request
     */
    sendVerifyEmail: builder.mutation<HttpResponse, void>({
      query: () => ({
        url: "/email-verify/send",
        method: "POST"
      })
    }),

    /**
     * Gets all users or searches for users by username.
     * @request
     */
    getUsers: builder.query<HttpResponse<{ users: MinUserCredentials[] | UserCredentials[] }>, string | void>({
      queryFn: async (username, { getState }, _, baseQuery) => {
        if (username && !(getState() as RootState).auth.user.credentials?.email_verified) 
          return {
            error: {
              data: { allow: true, ERROR: "You must be verified to search users." },
              status: 401,
            },
          };
        
        const res = await baseQuery({
          url: "/users",
          method: "GET",
          ...(username && { params: { username } }),
        }) as QueryReturnValue<
          HttpResponse<{ users: MinUserCredentials[] | UserCredentials[] }>,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;

        return res.error
          ? {
              error: res.error.status === 500 && res.meta?.request.url.includes("?username=", -1)
                  ? allow500ErrorsTransform(res.error!, res.meta)
                  : res.error,
            }
          : { data: res.data };
      }
    }),

    /**
     * 
     * @request
     */
    getUser: builder.query<HttpResponse<{ user: UserCredentials | GetNotificationsResponseDto }>, { notifications: boolean } | void>({
      query: (args) => ({
        url: "/user",
        method: "GET",
        ...(args?.notifications && { params: { notifications: args.notifications } })
      }),
      providesTags: ["Notification"],
      onQueryStarted: (_, { dispatch, queryFulfilled }) => {
        queryFulfilled.catch((error) => {
          if (isFetchBaseQueryError(error.error)) {
            if (error.error.status === 404)
              dispatch(
                unexpectedErrorToast(
                  "We couldn't find your profile on our server."
                )
              );
          }
        })
      }
    }),

    // TODO: Clear user.

    /**
     * Deletes the current user from existence.
     * @request
     */
    deleteUser: builder.mutation<HttpResponse, void>({
      query: () => ({
        url: "/user/delete",
        method: "DELETE",
      })
    }),

    /**
     * Deletes the given notifications from the current user.
     * @request
     */
    deleteUserNotifications: builder.mutation<
      HttpResponse<{ user: { notifications: Notification[] } }>,
      DeleteNotificationsBodyDto
    >({
      query: (body) => ({
        url: "/user/delete/notifications",
        method: "POST",
        body
      }),
      // invalidatesTags: ["Notification"]
    }),

    /**
     * 
     * @request
     */
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
          socket.disconnect()
          getSocketInstance("chat").disconnect()
          alert("User login session timed out.")
        }
      }
    }),

    /**
     * Initializes all friend rooms and friend activity statuses.
     * @emitter
     */
    initializeFriends: builder.mutation<SocketResponse, { friends: FriendCredentials[] }>({
      queryFn: async (data) => emitAsPromise(socket)(AuthEvent.INITIALIZE_FRIENDS, data)
    }),

    /**
     * Join and leaves of friend rooms.
     * @emitter
     */
    // Idk if I need this.
    manageFriendRoom: builder.mutation<SocketResponse, ManageFriendRoomDto>({
      queryFn: async (data) => emitAsPromise(socket)(AuthEvent.MANAGE_FRIEND_ROOM, data)
    }),

    /**
     * Friend Requests and adding a friend.
     * @emitter
     */
    manageFriendRequest: builder.mutation<SocketResponse<{ updated_user: UserCredentials }>, ManageFriendRequestDto>({
      queryFn: async (data, { getState, dispatch }) => {
        const user = (getState() as RootState).auth.user.credentials;

        // TODO: I may need the toasts later on, so they're left here.
        if (!user?.email_verified) {
          const errorMsg = "You must be verified to add friends.";

          // dispatch(
          //   ADD_TOAST({
          //     title: "Unauthorized",
          //     message: `${errorMsg} Send verification email.`,
          //     intent: "error",
          //     options: {
          //       button: {
          //         sequence: "Send verification email.",
          //         onClick: () => handleSendVerifyEmail(dispatch),
          //       },
          //     },
          //   })
          // );
          return { error: { allow: true, data: { ERROR: errorMsg }, status: "unauthorized" } };
        } else if (
          user.friends.pending.concat(user.friends.list).some((friend) => friend.username === data.friend.username)
        ) {
          const errorMsg = "You already requested or added this friend.";
          
          // dispatch(
          //   ADD_TOAST({
          //     title: "Already Sent/Friended",
          //     message: errorMsg,
          //     intent: "error",
          //   })
          // );
          return { error: { data: { ERROR: errorMsg }, status: "bad request" } };
        }

        const res = await emitAsPromise(socket)(AuthEvent.MANAGE_FRIEND_REQUEST, data);
        console.log("res", res)
        
        return res.error
          ? {
              error: {
                ...res.error,
                data: {
                  ...(allow500ErrorsTransform(res.error!, res.meta).data as any),
                  ERROR: res.error.status === "unauthorized" ? res.error.ERROR : "An unexpected error occurred.",
                }
              }
            }
          : res;
      },
      onQueryStarted: async ({ action_type }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          console.log("MANAGE FRIEND DATA", data)

          if (data.status === "ok" && action_type === "request" && data.updated_user) {
            dispatch(UPDATE_USER_CREDENTIALS(data.updated_user));
            // dispatch(
            //   ADD_TOAST({
            //     title: action_type === "request" ? "Friend Request Sent" : "Friend Added",
            //     message: data.message,
            //     intent: "success",
            //   })
            // );
          }
          } catch (error: any) {
            if (isFetchBaseQueryError(error.error)) {
              const resError = error.error
              // if (resError.status === "not found")
              //   dispatch(unexpectedErrorToast(resError.data.ERROR));
              // else if (resError.status === "unauthorized" && resError.ERROR.includes("isn't verified."))
              //   dispatch(ADD_TOAST({ title: "Cannot Send", message: resError.data.ERROR, intent: "error" }));
            } else {
              logger.error("authApi manageFriendRequest error:\n", error.message);
            }
          }
      },
      // transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * Receives new entries within the user's friends.
     * @listener
     * TODO:
     */
    // Idk what would be the socket response up here for a listener.
    [authSocketListeners.friendsUpdate]: builder.mutation<{ resourcesLoaded?: boolean }, { resourcesLoaded?: boolean }>({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        
        if (data.resourcesLoaded) {
          logger.debug("friendsUpdate listener initialized.");

          socket.on(AuthEvent.FRIENDS_UPDATE, (data: { friends: UserCredentials["friends"] }) => {
            // let patchResult: PatchCollection | undefined;

            try {
              console.log("FRIEND UPDATE", data);

              dispatch(UPDATE_USER_CREDENTIALS({ friends: data.friends })); // TODO: Might be getting back single friends too if I remove friendActivity.

              // patchResult = dispatch(
              //   authApi.util.updateQueryData("", undefined, (cache) => {
              //     console.log("CACHE", cache);
              //     cache.push(data);
              //   }
              // ));
              // authApi.util.invalidateTags([""]);
            } catch (error: any) {
              // if (patchResult) patchResult.undo();
              history.push("/error-500");
              logger.error("authApi friendsUpdate error:\n", error.message);
            }
          });
        } 
      }
    }),

    /**
     * TODO:
     * @listener
     */
    [authSocketListeners.friendActivity]: builder.mutation<{ resourcesLoaded?: boolean }, { resourcesLoaded?: boolean }>({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async (_, { getState, dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        
        if (data.resourcesLoaded) {
          logger.debug("friendActivity listener initialized.");

          socket.on(AuthEvent.FRIEND_ACTIVITY, (data: { friend: FriendCredentials; status: ActivityStatuses }) => {
            // let patchResult: PatchCollection | undefined;

            try {
              console.log("FRIEND ACTIVITY", data);

              const state = (getState() as RootState).auth.user.credentials?.friends.list;
              const friendChange = state?.find(({ username }) => username === data.friend.username )
              // friendChange?.status = data.status;
  
              // dispatch(UPDATE_USER_CREDENTIALS({ friends: { list: ...friendChange! } }));
  
              // TODO: If what comes is status offline, disconnect from their room?

              // patchResult = dispatch(
              //   authApi.util.updateQueryData("", undefined, (cache) => {
              //     console.log("CACHE", cache);
              //     cache.push(data);
              //   }
              // ));
              // authApi.util.invalidateTags([""]);
            } catch (error: any) {
              // if (patchResult) patchResult.undo();
              history.push("/error-500");
              logger.error("authApi friendActivity error:\n", error.message);
            }
          });
        } 
      }
    }),

    /**
     * All incoming notifications from the server (friend requests, system messages, news, etc).
     * @listener
     * // TODO:
     */
    [authSocketListeners.newNotification]: builder.mutation<{ resourcesLoaded?: boolean }, { resourcesLoaded?: boolean }>({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        
        if (data.resourcesLoaded) {
          logger.debug("newNotification listener initialized.");

          // socket.on(AuthEvent.NEW_NOTIFICATION, (data: { type: ServerNotificationTypes; message: ServerNotification }) => {
          socket.on(AuthEvent.NEW_NOTIFICATION, (data: { notification: Notification }) => {          
            let patchResult: PatchCollection | undefined;

            try {
              console.log("NEW NOTIFICATION", data);
              const { type, title, message, link } = data.notification;

              dispatch(
                ADD_TOAST({
                  title,
                  message,
                  intent: "info",
                  options: { link }
                })
              );
              patchResult = dispatch(
                authApi.util.updateQueryData("getUser", undefined, (cache) => {
                  // FIXME: I never see this log.
                  console.log("CACHE", cache);
                  const notifications = (cache.user as GetNotificationsResponseDto)?.notifications;
                  if (notifications) notifications[type].push(data.notification);
                }
              ));
              dispatch(authApi.util.invalidateTags(["Notification"]));
            } catch (error: any) {
              if (patchResult) patchResult.undo();
              history.push("/error-500");
              logger.error("authApi newNotification error:\n", error.message);
            }
          });
        } 
      }
    })
  })
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
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useDeleteUserNotificationsMutation,
  // useDeleteUserMutation,
  useLogoutMutation,
  useInitializeFriendsMutation,
  // useManageFriendRoomMutation,
  useManageFriendRequestMutation,
} = authApi;

export default authApi;

export type LoginGoogleTriggerType = ReturnType<typeof useLoginGoogleMutation>[0];
