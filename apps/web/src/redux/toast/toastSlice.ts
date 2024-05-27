import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

export interface ToastPayload {
  id: string;
  title?: string;
  message: string;
  intent: "error" | "success" | "info";
}

export interface ToastState {
  count: ToastPayload[];
}

const initialState: ToastState = {
  count: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    ADD_TOAST: (state, action: PayloadAction<ToastPayload>) => {
      state.count = [...state.count, { ...action.payload, id: nanoid() }];
    },
    REMOVE_TOAST: (state, action: PayloadAction<{ id: string }>) => {
      state.count = state.count.filter(
        (toast) => toast.id !== action.payload.id
      );
    },
    CLEAR_TOASTS: (state) => {
      state.count = [];
    },
  },
});

export const { name: toastName, reducer: toastReducer } = toastSlice,
  { ADD_TOAST, REMOVE_TOAST, CLEAR_TOASTS } = toastSlice.actions;

export default toastSlice;
