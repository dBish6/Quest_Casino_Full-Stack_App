import { combineReducers } from "@reduxjs/toolkit";
import { stateReducers } from "./stateReducer";
import { rtkReducers } from "./rtkReducer";

export const rootReducer = combineReducers({
    ...stateReducers, ...rtkReducers
});
