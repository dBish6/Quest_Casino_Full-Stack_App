import { RootStore } from "./store";

let lazyStore: RootStore;

/**
 * Use this instead of importing it from `store.tsx` when you need to import the entire store
 * outside of components, etc.
 * 
 * (This prevents unnecessary loading of the 'client store' on the server).
 */
export default async function store() {
  if (!lazyStore) lazyStore = await import("./store").then((mod) => mod.default);
  return lazyStore;
}