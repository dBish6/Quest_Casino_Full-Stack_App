import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import blackjackReducer from "../features/games/blackjack/redux/blackjackSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducers = combineReducers({
    blackjack: blackjackReducer,
  }),
  persistedReducers = persistReducer(persistConfig, reducers);

const store = configureStore({
  // reducer: {
  //   blackjack: blackjackReducer,
  // },
  reducer: persistedReducers,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export default store;
