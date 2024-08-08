import type { TypedUseSelectorHook } from "react-redux";
import type { AuthState } from "@authFeat/redux/authSlice";
import type { ToastState } from "../src/redux/toast/toastSlice";

import { configureStore } from "@reduxjs/toolkit";
import { authName, authReducer } from "@authFeat/redux/authSlice";
import { toastName, toastReducer } from "../src/redux/toast/toastSlice";

import { useDispatch, useSelector } from "react-redux";

const authState: AuthState = {
  user: {
    credentials: {
      type: "standard",
      avatar_url: "/images/jamie-butler.webp",
      legal_name: { first: "Test", last: "Tester" },
      email_verified: false,
      username: "Testest",
      verification_token: "1234",
      country: "Canada",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt eget dui ac ornare. Sed congue tellus in lectus imperdiet, ac facilisis lorem suscipit. Nulla scelerisque consectetur ipsum.",
      balance: 0,
      friends: {
        pending: [],
        list: []
      },
      statistics: {
        losses: {
          total: 0,
          table: 0,
          slots: 0,
          dice: 0,
        },
        wins: {
          total: 0,
          table: 0,
          slots: 0,
          dice: 0,
          streak: 0,
          win_rate: 0,
        },
        completed_quests: new Map(),
      },
      ...({ status: "online" } as any) // Testing purposes; so we can see a "friend" status indicator.
    },
    token: { csrf: null },
  },
};

const toastState: ToastState = {
  count: [],
};

const initialState = {
  [authName]: authState,
  [toastName]: toastState,
};

const mockStore = configureStore({
  reducer: {
    [authName]: authReducer,
    [toastName]: toastReducer,
  },
  preloadedState: initialState,
});

export default mockStore;
export const useMockDispatch = () => useDispatch<typeof mockStore.dispatch>();
export const useMockSelector: TypedUseSelectorHook<
  ReturnType<typeof mockStore.getState>
> = useSelector;
