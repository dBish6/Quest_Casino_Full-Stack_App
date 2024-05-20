import type { TypedUseSelectorHook } from "react-redux";
import type { ToastState } from "../src/redux/toast/toastSlice";

import { configureStore } from "@reduxjs/toolkit";
import { toastName, toastReducer } from "../src/redux/toast/toastSlice";

import { useDispatch, useSelector } from "react-redux";

const toastState: ToastState = {
  count: [],
};

const initialState = {
  [toastName]: toastState,
};

const mockStore = configureStore({
  reducer: {
    [toastName]: toastReducer,
  },
  preloadedState: initialState,
});

export default mockStore;
export const useMockDispatch = () => useDispatch<typeof mockStore.dispatch>();
export const useMockSelector: TypedUseSelectorHook<
  ReturnType<typeof mockStore.getState>
> = useSelector;
