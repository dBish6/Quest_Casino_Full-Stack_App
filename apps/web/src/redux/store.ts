import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { rootReducer } from "./reducers";
import { apiErrorHandler } from "@services/apiErrorHandler";
import { authMiddleware } from "@authFeat/services/authApi";

const preloadedState = window.__PRELOADED_STATE__ || {};
delete window.__PRELOADED_STATE__;

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiErrorHandler,
      authMiddleware as Middleware
    ),
});

setupListeners(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
