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
     * Use for updating base credentials.
     */
    UPDATE_USER_CREDENTIALS: (state, action: PayloadAction<Partial<UserCredentials>>) => {
      state.user.credentials = deepMerge([state.user.credentials!, action.payload]);
    },
    /**
     * Updates the user's friends object.
     */
    UPDATE_USER_FRIENDS: (state, action: PayloadAction<UserCredentials["friends"]>) => {
      state.user.credentials!.friends = deepMerge([state.user.credentials!.friends, action.payload]);
    },
    /**
     * Updates a friend in the user's friends list.
     */
    UPDATE_USER_FRIEND_IN_LIST: (
      state,
      action: PayloadAction<{ verToken: string; update: Partial<FriendCredentials> }>
    ) => {
      const key = action.payload.verToken,
        friendState = state.user.credentials!.friends.list[key];

      if (!friendState)
        return logger.error(
          "UPDATE_USER_FRIEND_IN_LIST authSlice action error:\n",
          `Failed to find friend ${key} in the friend's list.`
        );

      state.user.credentials!.friends.list[key] = deepMerge([friendState, action.payload.update]);
    },
    CLEAR_USER: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { name: authName, reducer: authReducer } = authSlice,
  {
    INITIALIZE_SESSION,
    UPDATE_USER_CREDENTIALS,
    UPDATE_USER_FRIENDS,
    UPDATE_USER_FRIEND_IN_LIST,
    CLEAR_USER
  } = authSlice.actions;

export default authSlice;
