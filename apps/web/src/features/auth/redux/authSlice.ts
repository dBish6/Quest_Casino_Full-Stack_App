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
  }
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
    SET_OSTATE_TOKEN: (state, action: PayloadAction<StateUser["token"]["oState"]>) => {
      state.user.token.oState = action.payload;
    },
    /**
     * Use for updating base credentials.
     */
    UPDATE_USER_CREDENTIALS: (state, action: PayloadAction<Partial<UserCredentials>>) => {
      state.user.credentials = deepMerge([state.user.credentials!, action.payload]);
    },
    /**
     * Sets or overrides the user's favourites object.
     */
    SET_USER_FAVOURITES: (state, action: PayloadAction<UserCredentials["favourites"]>) => {
      state.user.credentials!.favourites = action.payload;
    },
    /**
     * Sets or overrides the user's settings object.
     */
    SET_USER_SETTINGS: (state, action: PayloadAction<UserCredentials["settings"]>) => {
      state.user.credentials!.settings = action.payload;
    },
    /**
     * Updates the user's friends object.
     */
    UPDATE_USER_FRIENDS: (state, action: PayloadAction<Partial<UserCredentials["friends"]>>) => {
      state.user.credentials!.friends = deepMerge([state.user.credentials!.friends, action.payload]);
    },
    /**
     * Updates a friend in the user's friends list.
     */
    UPDATE_USER_FRIEND_IN_LIST: (
      state,
      action: PayloadAction<{ memberId: string; update: Partial<FriendCredentials> }>
    ) => {
      const key = action.payload.memberId,
        friendState = state.user.credentials!.friends.list[key];

      if (!friendState)
        return logger.error(
          "UPDATE_USER_FRIEND_IN_LIST authSlice action error:\n",
          `Failed to find friend ${key} in the friend's list.`
        );

      state.user.credentials!.friends.list[key] = deepMerge([friendState, action.payload.update]);
    },
    /**
     * Removes a friend from the pending or friends list.
     */
    REMOVE_USER_FRIEND: (
      state,
      action: PayloadAction<{ pending?: string; list?: string }>
    ) => {
      for (const [key, memberId] of Object.entries(action.payload)) {
        if (key in state.user.credentials!.friends)
          delete (state.user.credentials!.friends as any)[key][memberId];
      }
    },
    /**
     * Updates the user's statistics progress object.
     */
    UPDATE_USER_STATISTICS_PROGRESS: (
      state,
      action: PayloadAction<Partial<UserCredentials["statistics"]["progress"]>>
    ) => {
      state.user.credentials!.statistics.progress = deepMerge([
        state.user.credentials!.statistics.progress,
        action.payload
      ]);
    },
    CLEAR_USER: (state) => {
      state.user = initialState.user;
    }
  }
});

export const { name: authName, reducer: authReducer } = authSlice,
  {
    INITIALIZE_SESSION,
    SET_OSTATE_TOKEN,
    UPDATE_USER_CREDENTIALS,
    SET_USER_FAVOURITES,
    SET_USER_SETTINGS,
    UPDATE_USER_FRIENDS,
    UPDATE_USER_FRIEND_IN_LIST,
    REMOVE_USER_FRIEND,
    UPDATE_USER_STATISTICS_PROGRESS,
    CLEAR_USER
  } = authSlice.actions;

export default authSlice;
