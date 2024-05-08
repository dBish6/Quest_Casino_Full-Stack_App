import type UserCredentials from "../typings/User";

import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    credentials: UserCredentials | null;
    token: string | null;
  };
}

export const initialState: AuthState = {
  user: {
    credentials: null,
    token: null,
  },
  // user: null,
};

export const chatSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_USER: (state, action) => {
      state.user = {
        credentials: action.payload.user,
        token: action.payload.token,
      };
    },
    // SET_TOKEN: (state, action) => {
    //   state.roomId = action.payload;
    // },
    CLEAR_USER: (state) => {
      state.user = {
        credentials: null,
        token: null,
      };
    },
  },
});

export const {
  // SET_TOKEN,
  SET_USER,
  CLEAR_USER,
} = chatSlice.actions;

export default chatSlice.reducer;
