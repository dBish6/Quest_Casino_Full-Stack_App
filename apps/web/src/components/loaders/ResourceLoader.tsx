import type { FeatureBundle } from "framer-motion";
import type { TimeoutObj } from "@services/socket";

import { createContext, useRef, useState, useLayoutEffect } from "react";

import { logger } from "@qc/utils";
import delay from "@utils/delay";
import { history } from "@utils/History";

import { useAppSelector } from "@redux/hooks";
import { selectUserCsrfToken } from "@authFeat/redux/authSelectors";

import { socketInstancesConnectionProvider } from "@services/socket";

import OverlayLoader from "./overlay/OverlayLoader";

export interface ResourceLoaderContextValues {
  resourcesLoaded: boolean | undefined;
}

export const ResourceLoaderContext = createContext<ResourceLoaderContextValues | undefined>(undefined);

export default function ResourceLoaderProvider({ children }: React.PropsWithChildren<{}>) {
  const FramerFeatureBundleRef = useRef<{
    LazyMotion?: React.ElementType;
    domMax?: FeatureBundle;
  }>({}),
  [progress, setProgress] = useState({
    loading: false, // I would love to show the loader initially but the portal in OverlayLoader breaks hydration.
    message: "Loading animating magic...",
  });

  const userToken = useAppSelector(selectUserCsrfToken);

  if (typeof window !== "undefined") {
    useLayoutEffect(() => {
      if (!progress.loading) {
        setProgress((prev) => ({ ...prev, loading: true }));
        const timeoutObj: TimeoutObj = {};

        (async () => {
          try {
            if (!FramerFeatureBundleRef.current.LazyMotion || !FramerFeatureBundleRef.current.domMax) {
              const { LazyMotion, domMax } = await import("framer-motion");

              FramerFeatureBundleRef.current = { LazyMotion, domMax };
              await delay(1500);
            }

            setProgress((prev) => ({ ...prev, message: "Syncing You with Others..." }));
            delay(29000, () => {
              if (!progress.loading)
                setProgress((prev) => ({ ...prev, message: "Taking longer than expected..." }));
            });
            if (userToken) await socketInstancesConnectionProvider(timeoutObj)
          } catch (error: any) {
            logger.error("Loading resources error:\n", error.message);
            if (error.message.includes("stable connection")) history.push("/error-500");
          } finally {
            setProgress((prev) => ({ ...prev, loading: false }));
          }
        })();

        return () => Object.values(timeoutObj).forEach((timeout) => clearTimeout(timeout));
      }
    }, [userToken]);
  }

  const { LazyMotion, domMax } = FramerFeatureBundleRef.current;
  return (
    <ResourceLoaderContext.Provider value={{ resourcesLoaded: LazyMotion && progress.loading === false }}>
      {progress.loading && <OverlayLoader message={progress.message} />}
      {LazyMotion ? (
        <LazyMotion features={domMax} strict>
          {children}
        </LazyMotion>
      ) : (
        children
      )}
    </ResourceLoaderContext.Provider>
  );
};
