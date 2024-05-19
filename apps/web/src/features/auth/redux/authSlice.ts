import type UserCredentials from "../typings/UserCredentials";

import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    credentials: UserCredentials | null;
    // token: string | null;
  };
}

const initialState: AuthState = {
  user: {
    credentials: null,
    // token: null,
  },
  // user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      state.user = {
        credentials: action.payload.user,
        // token: action.payload.token,
      };
    },
    // SET_TOKEN: (state, action) => {
    //   state.roomId = action.payload;
    // },
    CLEAR_USER: (state) => {
      state.user = {
        credentials: null,
        // token: null,
      };
    },
  },
});

export const { name: authName, reducer: authReducer } = authSlice,
  {
    SET_USER,
    // SET_TOKEN,
    CLEAR_USER,
  } = authSlice.actions;

export default authSlice;
