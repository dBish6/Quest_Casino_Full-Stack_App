import type { GlobalChatRoomId } from "@qc/typescript/typings/ChatRoomIds";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { logger } from "@qc/utils";
import { deepMerge } from "@utils/deepMerge";

export interface RestrictionState {
  started: boolean;
  multiplier: number;
  remaining: number;
  resetTime: number;
}

export interface ChatState {
  globalRoomId: GlobalChatRoomId | null;
  restriction: RestrictionState;
}

const BASE_RESTRICTION_DURATION = 1000 * 60 * 5, // 5 Minutes
  RESTRICTION_RESET_TIME = 1000 * 60 * 60 * 24 * 7; // 1 Week

const initialState: ChatState = {
  globalRoomId: null,
  restriction: { started: false, multiplier: 1, remaining: 0, resetTime: 0 }
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SET_GLOBAL_CHAT_ROOM_ID: (state, action: PayloadAction<GlobalChatRoomId>) => {
      state.globalRoomId = action.payload;
    },
    /**
     * Handles starting and stopping a chat restriction.
     */
    TOGGLE_RESTRICTION: (state, action: PayloadAction<boolean>) => {
      let newState: Partial<RestrictionState>,
        { multiplier } = state.restriction;

      if (action.payload) {
        newState = { 
          started: true, 
          remaining: BASE_RESTRICTION_DURATION * multiplier,
          multiplier: ++multiplier, 
          resetTime: RESTRICTION_RESET_TIME
         }
      } else {
        newState = { started: false, remaining: 0 }
      }

      state.restriction = { ...state.restriction, ...newState };
    },
    /**
     * Updates the remaining time of a chat restriction.
     */
    UPDATE_RESTRICTION_TIME: (state, action: PayloadAction<{ key: "remaining" | "resetTime"; time: number }>) => {
      state.restriction[action.payload.key] = action.payload.time;
    },
    /**
     * Resets the `resetTime` of a restriction and halves the multiplier as a reward.
     */
    RESTRICTION_RESET_TIME_ELAPSED : (state) => {
      state.restriction = {
        ...state.restriction,
        multiplier: Math.max(1, Math.floor(state.restriction.multiplier / 2)),
        resetTime: 0,
      };
    },
    /**
     * Clears the chat state with some exceptions.
     * - When a chat restriction is still started the restriction state is not cleared.
     * - Else all state is cleared expect for `multiplier` since it acts as a penalty and `resetTime` always needs to be counting down if needed.
     */
    CLEAR_CHAT: (state) => {
      const { started, multiplier, resetTime } = state.restriction;

      if (started) return { ...initialState, restriction: state.restriction };
      else return deepMerge([initialState, { restriction: { multiplier, resetTime } }]);
    },
  },
});

export const { name: chatName, reducer: chatReducer } = chatSlice,
  {
    SET_GLOBAL_CHAT_ROOM_ID,
    TOGGLE_RESTRICTION,
    UPDATE_RESTRICTION_TIME,
    RESTRICTION_RESET_TIME_ELAPSED,
    CLEAR_CHAT
  } = chatSlice.actions;

export default chatSlice.reducer;
