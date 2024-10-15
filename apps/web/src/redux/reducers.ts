import { combineReducers } from "@reduxjs/toolkit";

import { apiReducerPath, apiReducer } from "@services/api";
import { authName, authReducer } from "@authFeat/redux/authSlice";
import { toastName, toastReducer } from "./toast/toastSlice";
import { chatName, chatReducer } from "@chatFeat/redux/chatSlice";

export const rootReducer = combineReducers({
  [apiReducerPath]: apiReducer,
  [authName]: authReducer,
  [toastName]: toastReducer,
  [chatName]: chatReducer
});
