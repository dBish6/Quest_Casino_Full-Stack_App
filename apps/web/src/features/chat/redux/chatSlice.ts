import type ChatRoomAccessType from "@qc/typescript/typings/ChatRoomAccessType";
import type { LastChatMessageDto } from "@qc/typescript/dtos/ChatMessageEventDto";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";

import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { deepMerge } from "@utils/deepMerge";

export interface ChatRoomState {
  loading: boolean;
  snapshotId?: string; // Because the currentId can be null.
  /** The value to become the currentId. */
  proposedId: string | null;
  currentId: string | null;
  accessType: ChatRoomAccessType;
  /** The last chat message sent in an ongoing private chat room. */
  readonly lastChatMessage?: LastChatMessageDto;
  /** The target friend to display in a private chat room. */
  targetFriend?: { 
    memberIdSnapshot: string,
    friend: FriendCredentials | null;
    isTyping?: boolean;
  }
}

export interface ChatRestrictionState {
  started: boolean;
  multiplier: number;
  remaining: number;
  resetTime: number;
}

export interface ChatState {
  initialized: boolean;
  room: ChatRoomState;
  restriction: ChatRestrictionState;
}

const BASE_RESTRICTION_DURATION = 1000 * 60 * 5, // 5 minutes.
  RESTRICTION_RESET_TIME = 1000 * 60 * 60 * 24 * 7; // 1 week.

const initialState: ChatState = {
  initialized: false,
  room: { loading: false, proposedId: null, currentId: null, accessType: "global" },
  restriction: { started: false, multiplier: 1, remaining: 0, resetTime: 0 }
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    SET_CHAT_INITIALIZED: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    SET_CHAT_ROOM_LOADING: (state, action: PayloadAction<boolean>) => {
      if (action.payload === false) state.room.lastChatMessage = undefined;
      state.room.loading = action.payload;
    },
    UPDATE_CHAT_ROOM: (state, action: PayloadAction<Partial<ChatRoomState>>) => {
      if (action.payload.currentId) state.room.snapshotId = action.payload.currentId;
      state.room = { ...state.room, ...action.payload };
    },
    UPDATE_TARGET_FRIEND: (state, action: PayloadAction<NonNullable<Partial<ChatRoomState["targetFriend"]>>>) => {
      state.room.targetFriend = { ...state.room.targetFriend!, ...action.payload };
    },
    /**
     * Handles starting and stopping a chat restriction.
     */
    TOGGLE_RESTRICTION: (state, action: PayloadAction<boolean>) => {
      let newState: Partial<ChatRestrictionState>,
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
    SET_CHAT_INITIALIZED,
    SET_CHAT_ROOM_LOADING,
    UPDATE_CHAT_ROOM,
    UPDATE_TARGET_FRIEND,
    TOGGLE_RESTRICTION,
    UPDATE_RESTRICTION_TIME,
    RESTRICTION_RESET_TIME_ELAPSED,
    CLEAR_CHAT
  } = chatSlice.actions;

export default chatSlice.reducer;
