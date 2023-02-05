import { configureStore } from "@reduxjs/toolkit";
import blackjackSlice from "../features/games/blackjack/redux/blackjackSlice";

const store = configureStore({
  reducer: {
    blackjack: blackjackSlice,
  },
});

export default store;
