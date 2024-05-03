import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@authFeat/redux/authSlice";

export const stateReducer = combineReducers({
  auth: authReducer,
});
