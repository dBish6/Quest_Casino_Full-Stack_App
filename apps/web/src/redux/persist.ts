import type { RootState } from "./store";

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export function saveState(state: DeepPartial<RootState>) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (error: any) {
    console.error("saveState error:\n", error.message);
  }
}

export function loadState() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return undefined;
    
    return JSON.parse(serializedState);
  } catch (error: any) {
    console.error("loadState error:\n", error.message);
    return undefined;
  }
}
