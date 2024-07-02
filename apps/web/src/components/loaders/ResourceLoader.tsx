import type { FeatureBundle } from "framer-motion";
import type { TimeoutObj } from "@services/socket";

import { useRef, useState, useLayoutEffect } from "react";

import delay from "@utils/delay";

import { useAppSelector } from "@redux/hooks";
import { selectUserCsrfToken } from "@authFeat/redux/authSelectors";

import { socketInstancesConnectionProvider } from "@services/socket";

import OverlayLoader from "./overlay/OverlayLoader";

export default function ResourceLoader({ children }: React.PropsWithChildren<{}>) {
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
            if (userToken) await socketInstancesConnectionProvider(timeoutObj)

            delay(30000, () => {
              if (progress.loading)
                setProgress((prev) => ({ ...prev, message: "Taking longer than expected..." }));
            });
          } catch (error: any) {
            console.error("Loading resources error:\n", error.message);
            // history.push("/error-500");
          } finally {
            setProgress((prev) => ({ ...prev, loading: false }));
          }
        })();

        return () =>
          Object.values(timeoutObj).forEach((timeout) => clearTimeout(timeout));
      }
    }, [userToken]);
  }

  const { LazyMotion, domMax } = FramerFeatureBundleRef.current;
  return (
    <>
      {progress.loading && <OverlayLoader message={progress.message} />}
      {LazyMotion ? (
        <LazyMotion features={domMax} strict>
          {children}
        </LazyMotion>
      ) : (
        children
      )}
    </>
  );
}
