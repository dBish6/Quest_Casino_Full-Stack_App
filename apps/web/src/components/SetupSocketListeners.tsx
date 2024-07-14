import { useEffect } from "react";

import { useResourceLoaderContext } from "./loaders";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { authEndpoints, authSocketListeners } from "@authFeat/services/authApi";

export default function SocketListenersProvider() {
  const { resourcesLoaded } = useResourceLoaderContext();

  const user = useAppSelector(selectUserCredentials),
    dispatch = useAppDispatch();

  // resourcesLoaded can only go from false to true again when the user logs out, which disconnects all socket connections.
  useEffect(() => {
    if (user) {
      Object.keys(authSocketListeners).map((listener) =>
        dispatch(
          authEndpoints[listener as keyof typeof authSocketListeners].initiate({ resourcesLoaded })
        )
      );
    }
  }, [resourcesLoaded]);

  return null;
}
