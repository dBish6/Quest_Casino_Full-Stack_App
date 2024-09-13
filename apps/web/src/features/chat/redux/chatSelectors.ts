import type { RootState } from "@redux/store";

export const selectInitialized = (state: RootState) => state.chat.initialized,
  selectChatRoom = (state: RootState) => state.chat.room,
  selectRestriction = (state: RootState) => state.chat.restriction;
