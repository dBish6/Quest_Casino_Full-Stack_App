import { combineReducers } from "@reduxjs/toolkit";

import { reducers } from "./slices";
import { apiReducerPath, apiReducer } from "@services/api";

export const rootReducer = combineReducers({
  ...reducers,
  [apiReducerPath]: apiReducer
});