import { configureStore } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage";
// import { combineReducers } from "redux";
// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import thunk from 'redux-thunk';

import blackjackSlice from "../features/games/blackjack/redux/blackjackSlice";

// const reducers = combineReducers({
//   blackjack: blackjackSlice,
// });

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };
// const persistedReducers = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: {
    blackjack: blackjackSlice,
  },
  // reducer: persistedReducers,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
});

export default store;
