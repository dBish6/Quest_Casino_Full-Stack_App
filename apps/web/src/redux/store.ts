import { configureStore } from "@reduxjs/toolkit";

const preloadedState = window.__PRELOADED_STATE__ || {};
delete window.__PRELOADED_STATE__;

export const store = configureStore({
  reducer: {},
  preloadedState,
});
