import type { ActivityStatuses } from "@qc/typescript/typings/UserCredentials";

import { useRef } from "react";
import { throttle } from "tiny-throttle";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import { useUserActivityMutation } from "@authFeat/services/authApi";

const ACTIVITY_THRESHOLD = 1000 * 60 * 6; 
const KEYBOARD_ACTIONS: ReadonlySet<string> = new Set([" ", "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export default function AwayActivityTracker() {
  const user = useAppSelector(selectUserCredentials),
    status = useRef<ActivityStatuses>("online"); // Online when the component renders for the first time.

  const ticker = useRef<NodeJS.Timeout>(),
    [emitAwayActivity, { isLoading: awayActivityLoading }] = useUserActivityMutation(),
    [emitOnlineActivity, { isLoading: onlineActivityLoading }] = useUserActivityMutation();

  const startAwayCountdown = () => {
    ticker.current = setInterval(() => {
      if (status.current !== "away" && !awayActivityLoading)
        emitAwayActivity({ status: "away" })
          .then((res) => { if (res.data?.status === "ok") status.current = "away" });
    }, ACTIVITY_THRESHOLD); // 6 Minutes
  };

  useResourcesLoadedEffect(() => {
    // They have to be verified to manage friends so.
    if (user?.email_verified) {
      startAwayCountdown();

      const handleUserActivity = throttle(() => {
        clearInterval(ticker.current);
        startAwayCountdown();

        // Emits an updated activity status if the user was away.
        if (status.current === "away" && !onlineActivityLoading) 
          emitOnlineActivity({ status: "online" })
            .then((res) => { if (res.data?.status === "ok") status.current = "online" });
      }, 500);
      
      document.addEventListener("keydown", (e) => {
        if (KEYBOARD_ACTIONS.has(e.key)) handleUserActivity();
      });
      document.addEventListener("mousedown", handleUserActivity);
      document.addEventListener("touchstart", handleUserActivity);

      return () => {
        clearInterval(ticker.current);
        document.removeEventListener("keydown", handleUserActivity);
        document.removeEventListener("mousedown", handleUserActivity);
        document.addEventListener("touchstart", handleUserActivity);
      };
    }
  }, [user?.email_verified]);

  return null;
}
