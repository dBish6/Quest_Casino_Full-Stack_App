import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "@redux/store";
import type { UserCredentials, MinUserCredentials, UserProfileCredentials, ActivityStatuses } from "@qc/typescript/typings/UserCredentials";

import type { HttpResponse, SocketResponse } from "@typings/ApiResponse";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";
import type { LoginBodyDto, LoginGoogleBodyDto } from "@qc/typescript/dtos/LoginBodyDto";
import type { GetNotificationsResponseDto, DeleteNotificationsBodyDto, Notification } from "@qc/typescript/dtos/NotificationsDto"
import type { UpdateProfileBodyDto, UpdateProfileResponseDto, UpdateUserFavouritesBodyDto, SendConfirmPasswordEmailBodyDto } from "@qc/typescript/dtos/UpdateUserDto";
import type { ManageFriendRequestEventDto } from "@qc/typescript/dtos/ManageFriendEventDto";
import type FriendActivityEventDto from "@authFeat/dtos/FriendActivityEventDto";

import { AuthEvent } from "@qc/constants";
import TOKEN_EXPIRED_MESSAGE from "@authFeat/constants/TOKEN_EXPIRED_MESSAGE";
import GENERAL_UNAUTHORIZED_MESSAGE from "@authFeat/constants/GENERAL_UNAUTHORIZED_MESSAGE";
import GENERAL_FORBIDDEN_MESSAGE from "@authFeat/constants/GENERAL_FORBIDDEN_MESSAGE";

import { logger } from "@qc/utils";
import { history } from "@utils/History";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { injectEndpoints, prepareHeadersAndOptions } from "@services/api";
import { getSocketInstance, emitAsPromise } from "@services/socket";
import allow500ErrorsTransform from "@services/allow500ErrorsTransform";
import handleLogout from "./handleLogout";
import handleSendVerifyEmail from "./handleSendVerifyEmail";

import { UPDATE_USER_CREDENTIALS, SET_USER_FAVOURITES, UPDATE_USER_FRIENDS, UPDATE_USER_FRIEND_IN_LIST, INITIALIZE_SESSION, SET_USER_SETTINGS } from "@authFeat/redux/authSlice";
import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";

const socket = getSocketInstance("auth");
export const authSocketListeners = {
  friendsUpdate: "friendsUpdate",
  friendActivity: "friendActivity",
  newNotification: "newNotification",
} as const;

const authApi = injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    /**
     * Creates a new user.
     * @request
     */
    register: builder.mutation<HttpResponse, RegisterBodyDto>({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * Creates a user login session.
     * @request
     */
    login: builder.mutation<
      HttpResponse<{ user: UserCredentials }>,
      LoginBodyDto
    >({
      query: (credentials) => ({
        url: "/auth/login",
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
     * Creates a user login session via Google.
     * @request
     */
    loginGoogle: builder.mutation<
      HttpResponse<{ user: UserCredentials }>,
      LoginGoogleBodyDto
    >({
      query: (credentials) => ({
        url: "/auth/login/google",
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
     * Finalizes and verifies the user.
     * @request
     */
    emailVerify: builder.mutation<
      HttpResponse<{ user: UserCredentials }>,
      { verification_token: string }
    >({
      query: (body) => ({
        url: "/auth/email-verify",
        method: "POST",
        body
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled;

        if (meta?.response?.ok) {
          dispatch(UPDATE_USER_CREDENTIALS(data.user));
          dispatch(ADD_TOAST({ message: data.message, intent: "success" }));
        }
      }
    }),
    /**
     * Sends the email verification email.
     * @request
     */
    sendVerifyEmail: builder.mutation<HttpResponse, void>({
      query: () => ({
        url: "/auth/email-verify/send",
        method: "POST"
      })
    }),

    /**
     * Gets all users by search query (`username`) or a random set of set of users based on `count`.
     * @request
     */
    getUsers: builder.query<
      HttpResponse<{
        users: (MinUserCredentials[] & { bio?: string }) | UserCredentials[];
      }>,
      { username?: string; count?: number }
    >({
      queryFn: async (query, { getState }, _, baseQuery) => {
        const { username, count } = query;

        if (
          username &&
          !(getState() as RootState).auth.user.credentials?.email_verified
        )
          return {
            error: {
              data: {
                allow: true,
                ERROR: "You must be verified to search users."
              },
              status: 401
            }
          };

        const res = (await baseQuery({
          url: "/auth/users",
          method: "GET",
          params: { ...(username && { username }), ...(count && { count }) }
        })) as any;

        return res.error
          ? {
              error: res.meta?.request.url.includes("?", -1)
                ? allow500ErrorsTransform(res.error!, res.meta)
                : res.error
            }
          : res;
      }
    }),

    /**
     * Gets the current user or just their notifications.
     * @request
     */
    getUser: builder.query<
      HttpResponse<{ user: UserCredentials | GetNotificationsResponseDto }>,
      { notifications: boolean } | void
    >({
      query: (param) => ({
        url: "/auth/user",
        method: "GET",
        ...(param?.notifications && {
          params: { notifications: param.notifications }
        })
      }),
      providesTags: ["Notification"],
      onQueryStarted: (_, { dispatch, queryFulfilled }) => {
        queryFulfilled.catch((error) => {
          if (isFetchBaseQueryError(error.error) && error.error.status === 404)
            dispatch(
              unexpectedErrorToast(
                "We couldn't find your profile on our server.",
                false
              )
            );
        });
      }
    }),

    /**
     * Gets the profile data for the user's private profile page or get a user's public profile by `username`.
     *
     * Note: The profile data for the private profile page isn't the user credentials, this route gives us
     * 'extra' user credentials that we don't store on the client.
     * @request
     */
    getUserProfile: builder.query<
      HttpResponse<{
        // It's all of UserProfileCredentials when it's not requesting the current user (we get a profile by username).
        user:
          | { email: string; activity: UserProfileCredentials["activity"] }
          | UserProfileCredentials;
      }>,
      { username: string } | void
    >({
      query: (param) => ({
        url: "/auth/user/profile",
        method: "GET",
        ...(param?.username && { params: { username: param.username } })
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),
    /**
     * Updates their user profile; 'facing' credentials.
     * @request
     */
    updateProfile: builder.mutation<
      HttpResponse<UpdateProfileResponseDto>,
      UpdateProfileBodyDto
    >({
      queryFn: async (query, { getState, dispatch, signal }, _, baseQuery) => {
        if (query.settings) {
          const res = await fetch("api/v2/auth/user", {
              method: "PATCH",
              body: JSON.stringify(query),
              ...prepareHeadersAndOptions({ state: getState() as RootState }),
              keepalive: true,
              signal
            }),
            data: HttpResponse<UpdateProfileResponseDto> = await res.json();

          if (!res.ok) {
            dispatch(
              unexpectedErrorToast(
                "While adding your previously selected settings, there was a unexpected server error. You may have to edit those settings again, sorry for the inconvenience.",
                false
              )
            );

            return { error: allow500ErrorsTransform(data, res) };
          }

          return { data, meta: { response: res } };
        } else {
          const res = (await baseQuery({
            url: "/auth/user",
            method: "PATCH",
            body: query
          })) as any;
  
          return res.error
            ? { error: allow500ErrorsTransform(res.error!, res.meta) }
            : res;
        }
      },
      onQueryStarted: async ({ settings }, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok) {
            const { email, ...rest } = data.user;

            if (settings) dispatch(SET_USER_SETTINGS(rest.settings as UserCredentials["settings"]));
            else dispatch(UPDATE_USER_CREDENTIALS(rest));

            // Updated their email.
            if (data.refreshed)
              dispatch(
                ADD_TOAST({
                  title: "Verification Pending",
                  message: `Due to updating your email, you must verify again. We've sent you a new verification email.${data.refreshed.split("sent.")[1]}`,
                  intent: "info"
                })
              );
          }
        } catch (error: any) {
          const resError = error.error
          if (isFetchBaseQueryError(resError) && resError.data?.ERROR) {
            if (resError.status === 404 && resError.data.ERROR?.includes("to block")) {
              dispatch(
                ADD_TOAST({
                  title: "Can't Block",
                  message: resError.data.ERROR,
                  intent: "error"
                })
              );
            }
          } else {
            logger.error("authApi resetPassword error:\n", error.message);
          }
        }
      }
    }),

    /**
     * Add or delete the user's favourites.
     * @request
     */
    updateUserFavourites: builder.mutation<
      HttpResponse<{ favourites: UserCredentials["favourites"] }>,
      UpdateUserFavouritesBodyDto
    >({
      queryFn: async (query, { getState, dispatch, signal }) => {
        const res = await fetch("api/v2/auth/user/favourites", {
            method: "PATCH",
            body: JSON.stringify({ favourites: query.favourites }),
            ...prepareHeadersAndOptions({ state: getState() as RootState }),
            keepalive: true,
            signal
          }),
          data: HttpResponse<{ favourites: UserCredentials["favourites"] }> =
            await res.json();

        if (!res.ok) {
          dispatch(
            unexpectedErrorToast(
              "There was an unexpected error adding your previously selected game favorites."
            )
          );

          return { error: allow500ErrorsTransform(data, res) };
        }

        if (data.favourites) dispatch(SET_USER_FAVOURITES(data.favourites));
        return { data };
      }
    }),

    /**
     * Updates the user's password.
     * @request
     */
    resetPassword: builder.mutation<
      HttpResponse,
      { verification_token: string }
    >({
      query: (body) => ({
        url: "/auth/user/reset-password",
        method: "PATCH",
        body
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          if (meta?.response?.ok) {
            dispatch(ADD_TOAST({ message: data.message, intent: "success" }));
            handleLogout(dispatch, socket);
          }
        } catch (error: any) {
          const resError = error.error;
          if (isFetchBaseQueryError(resError) && resError.data?.ERROR) {
            if (
              resError.status === 429 ||
              (resError.status === 404 && resError.data.ERROR?.includes("pending password"))
            ) {
              dispatch(
                ADD_TOAST({
                  title: "Too Many Attempts",
                  message: resError.data.ERROR,
                  intent: "error"
                })
              );
            } else if ([401, 403].includes(resError.status as number)) {
              if (resError.data.ERROR.includes("expired")) {
                dispatch(
                  ADD_TOAST({
                    title: "Expired",
                    message: TOKEN_EXPIRED_MESSAGE("reset password"),
                    intent: "error"
                  })
                );
              } else {
                dispatch(
                  ADD_TOAST({
                    message:
                      resError.status === 401 ? GENERAL_UNAUTHORIZED_MESSAGE : GENERAL_FORBIDDEN_MESSAGE,
                    intent: "error"
                  })
                );
              }
            }
          } else {
            logger.error("authApi resetPassword error:\n", error.message);
          }
        }
      }
    }),

    /**
     * Sends password reset confirmation email.
     * @request
     */
    sendConfirmPasswordEmail: builder.mutation<
      HttpResponse,
      { param?: "forgot" } & SendConfirmPasswordEmailBodyDto
    >({
      query: ({ param = "", ...body }) => ({
        url: `/auth/user/reset-password${"/" + param}/confirm`,
        method: "POST",
        body
      }),
      onQueryStarted: async ({ param }, { dispatch, queryFulfilled }) => {
        const { data, meta } = await queryFulfilled;

        if (meta?.response?.ok && !param)
          dispatch(
            ADD_TOAST({
              title: "Confirmation Pending",
              message: data.message,
              intent: "info"
            })
          );
      },
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * Sends forgot password email.
     * @request
     */
    sendForgotPasswordEmail: builder.mutation<HttpResponse, { email: string }>({
      query: (body) => ({
        url: "/auth/user/reset-password/forgot",
        method: "POST",
        body
      }),
      transformErrorResponse: (res, meta) => allow500ErrorsTransform(res, meta)
    }),

    /**
     * Cancels password reset confirmation.
     * @request
     */
    revokePasswordReset: builder.mutation<HttpResponse, void>({
      query: () => ({
        url: "/auth/user/reset-password/revoke",
        method: "DELETE"
      })
    }),

    // TODO: Clear user.

    /**
     * Deletes the current user from existence.
     * @request
     * // TODO: Not used.
     */
    deleteUser: builder.mutation<HttpResponse, void>({
      query: () => ({
        url: "/auth/user",
        method: "DELETE"
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
        url: "/auth/user/notifications",
        method: "DELETE",
        body
      })
    }),

    /**
     * Clears the user session.
     * @request
     */
    logout: builder.mutation<HttpResponse, { username: string }>({
      query: (username) => ({
        url: "/auth/logout",
        method: "POST",
        body: username
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { meta } = await queryFulfilled;

        if (meta?.response?.ok) handleLogout(dispatch, socket);
      }
    }),

    /**
     * Initializes all friend rooms and friend activity statuses.
     * @emitter
     */
    initializeFriends: builder.mutation<
      SocketResponse<{ friends: UserCredentials["friends"] }>,
      { member_id: string }
    >({
      queryFn: async (data) =>
        emitAsPromise(socket)(AuthEvent.INITIALIZE_FRIENDS, data),
    }),

    /**
     * Manages friend requests including sending, accepting, and declining.
     * Also, checks if the user is verified and avoids duplicate requests.
     * @emitter
     */
    manageFriendRequest: builder.mutation<
      SocketResponse<{
        pending_friends: UserCredentials["friends"]["pending"];
      }>,
      ManageFriendRequestEventDto
    >({
      queryFn: async (data, { getState }) => {
        const user = (getState() as RootState).auth.user.credentials;

        // NOTE: I may need the toasts later on, so they're left here.
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
          return {
            error: {
              allow: true,
              data: { ERROR: errorMsg },
              status: "unauthorized"
            }
          };
        } else if (
          [user.friends.pending, user.friends.list].some(
            (friend) => friend[data.friend.member_id as any]?.username === data.friend.username
          )
        ) {
          const errorMsg = "You already requested or added this friend.";

          // dispatch(
          //   ADD_TOAST({
          //     title: "Already Sent/Friended",
          //     message: errorMsg,
          //     intent: "error",
          //   })
          // );
          return {
            error: { data: { ERROR: errorMsg }, status: "bad request" },
          };
        }

        const res = await emitAsPromise(socket)(AuthEvent.MANAGE_FRIEND_REQUEST, data);

        return res.error
          ? {
              error: {
                ...res.error,
                data: {
                  ...(allow500ErrorsTransform(res.error!, res.meta).data as any),
                  ERROR:
                    res.error.data?.ERROR.endsWith("in our system.") ||
                    res.error.status === "unauthorized"
                      ? res.error.data.ERROR
                      : "An unexpected error occurred."
                }
              }
            }
          : res;
      },
      onQueryStarted: async ({ action_type }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          logger.debug("MANAGE FRIEND", data);

          if (
            data.status === "ok" &&
            action_type === "request" &&
            data.pending_friends
          ) {
            dispatch(UPDATE_USER_FRIENDS({ pending: data.pending_friends }));
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
            // const resError = error.error
            // if (resError.status === "not found")
            //   dispatch(unexpectedErrorToast(resError.data.ERROR));
            // else if ((resError.status === "unauthorized" && resError.ERROR.includes("isn't verified.")))
            //   dispatch(ADD_TOAST({ title: "Cannot Send", message: resError.data.ERROR, intent: "error" }));
            // else if (resError.status === "bad request")
            //   dispatch(ADD_TOAST({ title: "Already Sent/Friended", message: resError.data.ERROR, intent: "error" }));
          } else {
            logger.error("authApi manageFriendRequest error:\n", error.message);
          }
        }
      },
    }),

    /**
     * Sends the user's new activity status.
     * @emitter
     */
    userActivity: builder.mutation<
      SocketResponse,
      { status: ActivityStatuses }
    >({
      queryFn: async (data) =>
        emitAsPromise(socket)(AuthEvent.USER_ACTIVITY, data)
    }),

    /**
     * Receives new friends to be added or removed for the user's pending or friends list.
     * @listener
     */
    [authSocketListeners.friendsUpdate]: builder.mutation<
      { resourcesLoaded?: boolean },
      { resourcesLoaded?: boolean }
    >({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        if (data.resourcesLoaded) {
          logger.debug("friendsUpdate listener initialized.");

          socket.on(AuthEvent.FRIENDS_UPDATE, ({ friends }: { friends: UserCredentials["friends"] }) => {
              try {
                logger.debug("FRIEND UPDATE", { friends });

                if ("list" in friends && "pending" in friends) {
                  dispatch(UPDATE_USER_FRIENDS(friends));
                } else {
                  logger.error("authApi friendsUpdate error:\n", "Received incorrect friends object.");
                }
              } catch (error: any) {
                history.push("/error-500");
                logger.error("authApi friendsUpdate error:\n", error.message);
              }
            }
          );
        }
      }
    }),

    /**
     * Receives status updates from friends in the user's friends list.
     * @listener
     */
    [authSocketListeners.friendActivity]: builder.mutation<
      { resourcesLoaded?: boolean },
      { resourcesLoaded?: boolean }
    >({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        if (data.resourcesLoaded) {
          logger.debug("friendActivity listener initialized.");

          socket.on(AuthEvent.FRIEND_ACTIVITY, ({ member_id, status }: FriendActivityEventDto) => {
              try {
                logger.debug("FRIEND ACTIVITY", { member_id, status });

                dispatch(
                  UPDATE_USER_FRIEND_IN_LIST({
                    memberId: member_id,
                    update: { activity: { status } }
                  })
                );
              } catch (error: any) {
                history.push("/error-500");
                logger.error("authApi friendActivity error:\n", error.message);
              }
            }
          );
        }
      }
    }),

    /**
     * All incoming notifications from the server (friend requests, system messages, news, etc).
     * @listener
     */
    [authSocketListeners.newNotification]: builder.mutation<
      { resourcesLoaded?: boolean },
      { resourcesLoaded?: boolean }
    >({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        if (data.resourcesLoaded) {
          logger.debug("newNotification listener initialized.");

          socket.on(AuthEvent.NEW_NOTIFICATION, (data: { notification: Notification }) => {
              let patchResult: any | undefined;

              try {
                logger.debug("NEW NOTIFICATION", data);
                const { type, title, message, link } = data.notification;

                dispatch(
                  ADD_TOAST({title, message, intent: "info", options: { link } })
                );
                patchResult = dispatch(
                  authApi.util.updateQueryData("getUser", undefined, (cache) => {
                      // FIXME: I never see this log.
                      console.log("CACHE", cache);
                      const notifications = (cache.user as GetNotificationsResponseDto)?.notifications;
                      if (notifications) notifications[type].push(data.notification);
                    }
                  )
                );
                dispatch(authApi.util.invalidateTags(["Notification"]));
              } catch (error: any) {
                if (patchResult) patchResult.undo();
                history.push("/error-500");
                logger.error("authApi newNotification error:\n", error.message);
              }
            }
          );
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
      // TODO:
      if ([""].includes(key as any)) {
        console.log("removed", key);
        params.delete(key);
      }
    }

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
                onClick: () => handleSendVerifyEmail(dispatch)
              }
            }
          })
        );
      } else {
        dispatch(
          ADD_TOAST({
            title: "Welcome",
            message: `Welcome back ${user.username}!`,
            intent: "success",
            duration: 6500
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
  useRegisterMutation,
  useLoginMutation,
  useLoginGoogleMutation,
  useEmailVerifyMutation,
  // useSendVerifyEmailMutation,
  useLazyGetUsersQuery,
  useLazyGetUserQuery,
  useLazyGetUserProfileQuery,
  useUpdateProfileMutation,
  useUpdateUserFavouritesMutation,
  useResetPasswordMutation,
  useSendConfirmPasswordEmailMutation,
  useSendForgotPasswordEmailMutation,
  useDeleteUserNotificationsMutation,
  // useDeleteUserMutation,
  useLogoutMutation,
  useInitializeFriendsMutation,
  useManageFriendRequestMutation,
  useUserActivityMutation
} = authApi;

export default authApi;

export type LoginGoogleTriggerType = ReturnType<typeof useLoginGoogleMutation>[0];
