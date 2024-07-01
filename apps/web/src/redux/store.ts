import type { StateUser } from "@authFeat/redux/authSlice";

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
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["meta.baseQueryMeta.request", "meta.baseQueryMeta.response", "payload.options.button.onClick"],
      },
    }).concat(apiErrorHandler, authMiddleware),
});

store.subscribe(
  throttle(() => {
    const state = store.getState(),
      user = state.auth.user;

    const targetPersistAuth: StateUser = {
      ...user,
      token: {
        csrf: user.token.csrf,
        ...(user.token.oState ? { oState: user.token.oState } : {}),
      },
    };

    const persisted = {
      auth: { user: targetPersistAuth },
    };
    saveState(persisted);
  }, 1000)
);

setupListeners(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
