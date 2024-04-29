import { FeatureBundle } from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";

import delay from "@utils/delay";

import { Button } from "@components/common/controls";

import s from "./resourceLoader.module.css";

export default function ResourceLoader({
  children,
}: React.PropsWithChildren<{}>) {
  const FramerFeatureBundleRef = useRef<{
      LazyMotion?: React.ElementType;
      domAnimation?: FeatureBundle;
    }>({}),
    [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    if (!loaded) {
      (async () => {
        const { LazyMotion, domAnimation } = await import("framer-motion");

        await delay(700, () => {
          FramerFeatureBundleRef.current = {
            LazyMotion: LazyMotion,
            domAnimation: domAnimation,
          };

          setLoaded(true);
        });
      })();
    }
  }, []);

  const { LazyMotion, domAnimation } = FramerFeatureBundleRef.current;
  return !loaded ? (
    <div role="status">
      <span>Just a moment...</span>
    </div>
  ) : LazyMotion ? (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  ) : (
    <div role="alert" className={s.error}>
      <h2>ERROR</h2>
      <p>Unexpected error loading custom recourses.</p>
      <Button
        intent="primary"
        size="xl"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
}
