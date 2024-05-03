import { combineReducers } from "@reduxjs/toolkit";
import { stateReducer } from "./stateReducer";
// import { rtkReducer } from "./rtkReducer";

export const rootReducer = combineReducers({
    ...stateReducer
});
