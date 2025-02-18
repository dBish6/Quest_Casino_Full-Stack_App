import type DeepPartial from "@qc/typescript/typings/DeepPartial";
import type { RootState } from "./store";

export function saveState(state: DeepPartial<RootState>) {
  try {
    if (typeof localStorage !== "undefined") {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("qc:state", serializedState);
    }
  } catch (error: any) {
    console.error("saveState error:\n", error.message);
  }
}

export function loadState() {
  try {
    const serializedState = localStorage.getItem("qc:state");
    if (serializedState === null) return undefined;
    
    return JSON.parse(serializedState);
  } catch (error: any) {
    console.error("loadState error:\n", error.message);
    return undefined;
  }
}
