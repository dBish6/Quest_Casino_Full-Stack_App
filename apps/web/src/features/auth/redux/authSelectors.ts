import type { RootState } from "@redux/store";

export const selectUser = (state: RootState) => state.auth.user,
  selectUserOStateToken = (state: RootState) => state.auth.user.token.oState;
