import { type EffectCallback, type DependencyList, useEffect } from "react";
import useResourceLoader from "./useResourceLoader";

/**
 * Triggers the effect only when `resourcesLoaded` is true.
 * 
 * Use when you need resources to be loaded in certain scenarios like dealing with a socket connection (chat or friends)
 * or you just want the UI to actually show (when resources are loaded) to display or run specific logic.
 */
export default function useResourcesLoadedEffect(
  effect: EffectCallback,
  deps: DependencyList = []
) {
  const { resourcesLoaded } = useResourceLoader();

  useEffect(() => {
    if (resourcesLoaded) effect();
  }, [resourcesLoaded, ...deps]);
}
