import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

interface ToastPayload {
  id: string;
  message: string;
  intent: string;
}

interface ToastState {
  count: ToastPayload[];
}

export const initialState: ToastState = {
  count: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    ADD_TOAST: (state, action: PayloadAction<ToastPayload>) => {
      const { message, intent } = action.payload;

      state.count = [...state.count, { id: nanoid(), message, intent }];
    },
    REMOVE_TOAST: (state, action: PayloadAction<{ id: string }>) => {
      state.count = state.count.filter(
        (toast) => toast.id !== action.payload.id
      );
    },
  },
});

export const {
  name: toastName,
  reducer: toastReducer,
  ...actions
} = toastSlice;

export default toastSlice;
