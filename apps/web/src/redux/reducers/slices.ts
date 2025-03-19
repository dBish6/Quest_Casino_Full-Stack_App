import { combineReducers } from "@reduxjs/toolkit";

import { authName, authReducer } from "@authFeat/redux/authSlice";
import { toastName, toastReducer } from "../toast/toastSlice";
import { chatName, chatReducer } from "@chatFeat/redux/chatSlice";

export const reducers = {
  [authName]: authReducer,
  [toastName]: toastReducer,
  [chatName]: chatReducer
};

export const slicesReducer = combineReducers(reducers);
