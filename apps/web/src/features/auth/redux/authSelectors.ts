import type { RootState } from "@redux/store";

export const selectUserCredentials = (state: RootState) => state.auth.user.credentials,
  selectUserCsrfToken = (state: RootState) => state.auth.user.token.csrf,
  selectUserOStateToken = (state: RootState) => state.auth.user.token.oState;
