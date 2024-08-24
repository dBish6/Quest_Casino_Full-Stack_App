import type { UserCredentials, FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { deepMerge } from "@utils/deepMerge";

/**
 * Current user stored in redux.
 */
export interface StateUser {
  credentials: UserCredentials | null;
  token: {
    oState?: { original: string; secret: string };
    csrf: string | null;
  };
}

export interface AuthState {
  user: StateUser;
}

export type FriendCredentialKeys = "pending" | "list";

const initialState: AuthState = {
  user: {
    credentials: null,
    token: { csrf: null }
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    INITIALIZE_SESSION: (state, action: PayloadAction<{ credentials: UserCredentials; csrf: string }>) => {
      state.user = {
        ...state.user,
        credentials: action.payload.credentials,
        token: { csrf: action.payload.csrf } // Removes oState so a new one from the server can be added.
      };
    },
    /**
     * Sets or overrides all of the user's credentials.
     */
    // SET_USER_CREDENTIALS: (state, action: PayloadAction<UserCredentials>) => {
    //   state.user.credentials = action.payload;
    // },
    /**
     * Use for updating base credentials.
     */
    UPDATE_USER_CREDENTIALS: (state, action: PayloadAction<Partial<UserCredentials>>) => {
      // state.user.credentials = { ...state.user.credentials!, ...action.payload };
      state.user.credentials = deepMerge([state.user.credentials!, action.payload]);
    },
    /**
     * Sets or overrides the user's friends object.
     */
    SET_USER_FRIENDS: (state, action: PayloadAction<UserCredentials["friends"]>) => {
      state.user.credentials!.friends = action.payload;
    },
    // UPDATE_USER_FRIENDS: (state, action: PayloadAction<FriendCredentials | MinUserCredentials>) => {
    //   const friend = action.payload as any,
    //     key = "status" in friend || "activity" in friend ? "list" : "pending";

    //     state.user.credentials!.friends[key] = {
    //       ...state.user.credentials!.friends.list,
    //       ...(key === "list" ? { [friend.verification_token || ""]: friend } : friend),
    //     };
    // },
    // UPDATE_USER_FRIENDS_LIST: (state, action: PayloadAction<Partial<UserCredentials["friends"]["list"]>>) => {
    //   // @ts-ignore
    //   state.user.credentials!.friends.list = { ...state.user.credentials!.friends.list, ...action.payload };
    // },
    /**
     * Updates a friend in the user's friends list.
     */
    // TODO: Remove this if used in one place.
    UPDATE_USER_FRIEND_IN_LIST: (
      state,
      action: PayloadAction<{ verToken: string; update: Partial<FriendCredentials> }>
    ) => {
      const key = action.payload.verToken,
        friendState = state.user.credentials!.friends.list[key];
        // toUpdate = action.payload.update

      if (!friendState)
        return logger.error(
          "UPDATE_USER_FRIEND_IN_LIST authSlice action error:\n",
          `Failed to find friend ${key} in the friend's list.`
        );

      // state.user.credentials!.friends.list[key] = {
      //   ...friendState,
      //   ...toUpdate,
      //   ...(toUpdate.activity && {
      //     activity: {
      //       ...friendState.activity,
      //       ...toUpdate.activity,
      //     },
      //   }),
      // };

      state.user.credentials!.friends.list[key] = deepMerge([friendState, action.payload.update]);
    },
    // SET_USER_FRIEND_IN_LIST: (state, action: PayloadAction<UserCredentials["friends"]>) => {
    //   // state.user.credentials!.friends = action.payload;
    //   state.user.credentials!.friends.list[action.payload.verification_token || ""] = action.payload;
    // },
    CLEAR_USER: (state) => {
      // state.user = {
      //   credentials: null,
      //   token: { csrf: null }
      // };
      state.user = initialState.user;
    },
  },
});

export const { name: authName, reducer: authReducer } = authSlice,
  {
    INITIALIZE_SESSION,
    // SET_USER_CREDENTIALS,
    UPDATE_USER_CREDENTIALS,
    SET_USER_FRIENDS,
    // UPDATE_USER_FRIENDS_LIST,
    UPDATE_USER_FRIEND_IN_LIST,
    // SET_USER_FRIEND_IN_LIST,
    CLEAR_USER
  } = authSlice.actions;

export default authSlice;
