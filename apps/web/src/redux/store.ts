import type { StateUser } from "@authFeat/redux/authSlice";
import type { ChatState } from "@chatFeat/redux/chatSlice";

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { throttle } from "tiny-throttle";

import { deepMerge } from "@utils/deepMerge";

import { rootReducer } from "./reducers";

import { loadState, saveState } from "./persist";
import { apiErrorHandler } from "@services/apiErrorHandler";
import { authMiddleware } from "@authFeat/services/authApi";
import { chatMiddleware } from "@chatFeat/services/chatApi";

const preloadedState = deepMerge([(window.__PRELOADED_STATE__ || {}), loadState()])
delete window.__PRELOADED_STATE__;

const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["meta.baseQueryMeta.request", "meta.baseQueryMeta.response", "meta.arg.originalArgs.callback", "payload.callback", "payload.options.button.onClick"],
      },
    }).concat(apiErrorHandler, authMiddleware, chatMiddleware),
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
    // TODO: Just pass state.chat if everything continues to be persisted.
    const targetPersistChat: Partial<ChatState> = {
      globalRoomId: state.chat.globalRoomId,
      restriction: state.chat.restriction
    };

    const persisted = {
      auth: { user: targetPersistAuth },
      chat: targetPersistChat
    };
    saveState(persisted);
  }, 1000)
);

setupListeners(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
