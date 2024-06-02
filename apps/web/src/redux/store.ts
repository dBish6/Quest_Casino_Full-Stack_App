import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { throttle } from "tiny-throttle";

import { rootReducer } from "./reducers";

import { loadState, saveState } from "./persist";
import { apiErrorHandler } from "@services/apiErrorHandler";
import { authMiddleware } from "@authFeat/services/authApi";

const preloadedState = {
  ...(window.__PRELOADED_STATE__ || {}),
  ...loadState(),
};
delete window.__PRELOADED_STATE__;

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiErrorHandler, authMiddleware),
});

store.subscribe(
  throttle(() => {
    const state = store.getState();

    const targetPersistAuth = state.auth,
      persisted = {
        auth: targetPersistAuth,
      };

    saveState(persisted);
  }, 1000)
);

setupListeners(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
