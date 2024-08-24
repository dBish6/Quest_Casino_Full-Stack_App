import type { RootState } from "@redux/store";

export const selectGlobalRoomId = (state: RootState) => state.chat.globalRoomId,
  selectRestriction = (state: RootState) => state.chat.restriction;
