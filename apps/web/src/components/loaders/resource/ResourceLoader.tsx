import type { FeatureBundle } from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";

import delay from "@utils/delay";

import OverlayLoader from "../overlay/OverlayLoader";

import s from "./resourceLoader.module.css";

export default function ResourceLoader({
  children,
}: React.PropsWithChildren<{}>) {
  const FramerFeatureBundleRef = useRef<{
      LazyMotion?: React.ElementType;
      domMax?: FeatureBundle;
    }>({}),
    [loading, setLoading] = useState(false); // I would love to show the loader initially but the portal in the loader breaks hydration.

  if (typeof window !== "undefined") {
    useLayoutEffect(() => {
      if (!loading) {
        setLoading(true);

        (async () => {
          const { LazyMotion, domMax } = await import("framer-motion");

          await delay(700, () => {
            FramerFeatureBundleRef.current = { LazyMotion, domMax };
            setLoading(false);
          });
        })();
        s;
      }
    }, []);
  }

  const { LazyMotion, domMax } = FramerFeatureBundleRef.current;
  return (
    <>
      {loading && <OverlayLoader message="Loading resources..." />}
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
