import type { RootState } from "@redux/store";

export const selectToasts = (state: RootState) => state.toast.count;
