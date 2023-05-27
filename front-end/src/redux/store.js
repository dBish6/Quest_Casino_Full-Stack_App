import { configureStore } from "@reduxjs/toolkit";
import blackjackReducer from "../features/games/blackjack/redux/blackjackSlice";

const store = configureStore({
  reducer: {
    blackjack: blackjackReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
