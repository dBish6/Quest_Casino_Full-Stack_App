import type { FeatureBundle } from "framer-motion";
import type { TimeoutObj } from "@services/socket";

import { createContext, useRef, useState, useLayoutEffect } from "react";

import { logger } from "@qc/utils";
import delay from "@utils/delay";
import { history } from "@utils/History";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectUserCsrfToken, selectUserCredentials } from "@authFeat/redux/authSelectors";
import { SET_USER_FRIENDS } from "@authFeat/redux/authSlice";
import { useInitializeFriendsMutation } from "@authFeat/services/authApi";

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

  const userToken = useAppSelector(selectUserCsrfToken),
    user = useAppSelector(selectUserCredentials),
    dispatch = useAppDispatch();

  const mutation = useRef<any>(),
    [emitInitFriends] = useInitializeFriendsMutation();

  const initializeFriends = async () => {
    mutation.current = emitInitFriends({ verification_token: user!.verification_token });
    mutation.current.then((res: any) => {
      if (res.data?.status === "ok") dispatch(SET_USER_FRIENDS(res.data.friends));
    })
  }

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
            if (user?.email_verified) {
              // The user must be verified to establish socket connection.
              await socketInstancesConnectionProvider(timeoutObj);
              await initializeFriends();
            }
          } catch (error: any) {
            logger.error("Loading resources error:\n", error.message);
            if (error.message.includes("stable connection")) history.push("/error-500");
          } finally {
            setProgress((prev) => ({ ...prev, loading: false }));
          }
        })();

        return () => {
          Object.values(timeoutObj).forEach((timeout) => clearTimeout(timeout));
          if (mutation.current) mutation.current.abort();
        };
      }
    }, [userToken, user?.email_verified]);
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
