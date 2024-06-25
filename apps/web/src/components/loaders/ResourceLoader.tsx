import type { FeatureBundle } from "framer-motion";
import type { Socket } from "socket.io-client";

import { useRef, useState, useLayoutEffect } from "react";

import { logger } from "@qc/utils";
import delay from "@utils/delay";
import { history } from "@utils/History";

import { instance } from "@services/socket";

import OverlayLoader from "./overlay/OverlayLoader";

export default function ResourceLoader({
  children,
}: React.PropsWithChildren<{}>) {
  const FramerFeatureBundleRef = useRef<{
      LazyMotion?: React.ElementType;
      domMax?: FeatureBundle;
    }>({}),
    [progress, setProgress] = useState({
      loading: false, // I would love to show the loader initially but the portal in the loader breaks hydration.
      message: "Loading animating magic..",
    });

  if (typeof window !== "undefined") {
    useLayoutEffect(() => {
      if (!progress.loading) {
        setProgress((prev) => ({ ...prev, loading: true }));
        const intervalArr: NodeJS.Timeout[] = [];

        (async () => {
          try {
            const { LazyMotion, domMax } = await import("framer-motion");

            FramerFeatureBundleRef.current = { LazyMotion, domMax };
            await delay(500);

            setProgress((prev) => ({
              ...prev,
              message: "Syncing the matrix...",
            }));
            await Promise.all(
              Object.entries(instance).map(([namespace, instance]) =>
                checkSocketConnection(namespace, instance, intervalArr)
              )
            );
          } catch (error: any) {
            console.error("Loading resources error:\n", error.message);
            history.push("/error-500");
          } finally {
            setProgress((prev) => ({ ...prev, loading: false }));
          }
        })();

        return () => {
          if (intervalArr.length) intervalArr.forEach(clearInterval);
        };
      }
    }, []);
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

async function checkSocketConnection(
  namespace: string,
  instance: Socket,
  intervalArr: NodeJS.Timeout[]
) {
  return new Promise<void>((resolve, reject) => {
    let retries = instance.io.opts.reconnectionAttempts!;

    if (instance.connected) {
      resolve();
    } else {
      const interval = setInterval(() => {
        if (retries === 0) {
          clearInterval(interval);
          reject(new Error(`Failed to establish a stable connection with ${namespace} socket instance.`)); // prettier-ignore
        }
        if (instance.connected) resolve(clearInterval(interval));

        logger.debug(
          `${namespace} socket instance connection status check failed; ${retries} retries left.`
        );
        retries--;
      }, 6000);

      intervalArr.push(interval);
    }
  });
}
