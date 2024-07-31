import { type EffectCallback, type DependencyList, useEffect } from "react";
import useResourceLoader from "./useResourceLoader";

/**
 * Triggers the effect only when `resourcesLoaded` is true.
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
