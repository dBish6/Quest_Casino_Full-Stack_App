import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { nanoid, createAction } from "@reduxjs/toolkit";

export interface ToastOptions {
  link?: {
    sequence: string;
    to: string;
  };
  button?: {
    sequence: string;
    onClick: () => void;
  };
}

export interface ToastPayload {
  id?: string;
  title?: string;
  message: string;
  intent?: "error" | "success" | "info";
  duration?: number;
  options?: ToastOptions;
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
      state.count = state.count.filter((toast) => toast.id !== action.payload.id);
    },
    CLEAR_TOASTS: (state) => {
      state.count = [];
    },
  },
});

export const { name: toastName, reducer: toastReducer } = toastSlice,
  { ADD_TOAST, REMOVE_TOAST, CLEAR_TOASTS } = toastSlice.actions;

export default toastSlice;

export const unexpectedErrorToast = createAction(
  ADD_TOAST.type,
  function (message?: string, askRefresh: boolean = true) {
    return {
      payload: {
        title: "Unexpected Error",
        message: `${message ?? "An unexpected error occurred."}${askRefresh ? " Please try refreshing the page." : ""} If the error persists, feel free to reach out to support.`,
        intent: "error",
        options: {
          link: {
            sequence: "support",
            to: "/support"
          }
        }
      }
    };
  }
);

/**
 * This will rarely happen since most browsers delete the Access token's cookie (session cookie) when it's expired 
 * but some browsers may not delete cookies by default so this is just in case.
 */


export const authTokenExpiredToast = createAction(
  ADD_TOAST.type,
  function () {
    return {
      payload: {
        title: "Session Expired",
        message: "Your login session has expired, log in.",
        intent: "error",
        options: {
          link: {
            sequence: "log in",
            to: `${window.location.pathname}?login=true`
          }
        }
      }
    };
  }
);
