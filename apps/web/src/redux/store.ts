import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { rootReducer } from "./reducers";
// import { middleware as authMiddleware } from "@authFeat/services/authApi";
// import { apiErrorHandler } from "@services/apiErrorHandler";

const preloadedState = window.__PRELOADED_STATE__ || {};
delete window.__PRELOADED_STATE__;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(
  //     authMiddleware as Middleware,
  //     apiErrorHandler
  //   ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
