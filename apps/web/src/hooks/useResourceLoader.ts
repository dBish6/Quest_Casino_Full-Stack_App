import { useContext } from "react";
import { ResourceLoaderContext } from "@components/loaders";

export default function useResourceLoader() {
  const context = useContext(ResourceLoaderContext);
  if (!context)
    throw new Error("useResourceLoader must be used within a ResourceLoaderProvider.");

  return context;
}
