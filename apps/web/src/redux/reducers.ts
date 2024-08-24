import { combineReducers } from "@reduxjs/toolkit";

import { authName, authReducer } from "@authFeat/redux/authSlice";
import { authApiReducerPath, authApiReducer } from "@authFeat/services/authApi";
import { toastName, toastReducer } from "./toast/toastSlice";
import { chatName, chatReducer } from "@chatFeat/redux/chatSlice";
import { chatApiReducerPath, chatApiReducer } from "@chatFeat/services/chatApi";

export const rootReducer = combineReducers({
  [authName]: authReducer,
  [authApiReducerPath]: authApiReducer,
  [toastName]: toastReducer,
  [chatName]: chatReducer,
  [chatApiReducerPath]: chatApiReducer
});
