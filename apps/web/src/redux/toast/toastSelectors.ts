import { useAppSelector } from "@redux/hooks";

export const selectToasts = useAppSelector((state) => state.toast.count);
