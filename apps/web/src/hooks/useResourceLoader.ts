import { useContext } from "react";
import { ResourceLoaderContext } from "@components/loaders";

export default function useResourceLoader() {
  const context = useContext(ResourceLoaderContext);
  if (!context)
    throw new Error("useResourceLoaderContext must be used within a ResourceLoaderProvider.");

  return context;
}
