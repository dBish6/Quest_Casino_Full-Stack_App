import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    UPDATE_USER_CREDENTIALS: (state, action: PayloadAction<Partial<UserCredentials>>) => {
      const credentials = state.user.credentials as UserCredentials;

      state.user.credentials = {
        ...credentials,
        ...action.payload,
        friends: {
          ...credentials.friends,
          ...action.payload.friends
        },
        statistics: {
          ...credentials.statistics,
          ...action.payload.statistics
        },
      };
    },
    CLEAR_USER: (state) => {
      state.user = {
        credentials: null,
        token: { csrf: null }
      };
    },
  },
});

export const { name: authName, reducer: authReducer } = authSlice,
  { INITIALIZE_SESSION, UPDATE_USER_CREDENTIALS, CLEAR_USER } = authSlice.actions;

export default authSlice;
