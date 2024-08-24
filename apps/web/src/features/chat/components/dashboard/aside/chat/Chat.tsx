import type { Variants } from "framer-motion";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import { useSearchParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { m } from "framer-motion";

import RestrictionManager from "@chatFeat/utils/RestrictionManager";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectRestriction } from "@chatFeat/redux/chatSelectors";

import { Button, Select } from "@components/common/controls";
import { Icon, Blob } from "@components/common";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";

import s from "./chat.module.css";

const shrinkInOut: Variants = {
  enlarged: {
    height: "89%",
    transition: { type: "spring", duration: 0.85 },
  },
  shrunk: {
    height: "81.2px",
    transition: { type: "spring", duration: 0.85 },
  },
};

export default function Chat({ user }: { user: UserCredentials | null }) {
  const [searchParams, setSearchParams] = useSearchParams(),
    // FIXME: I think there is a mix up.
    asideState = searchParams.get("aside"),
    chatState = searchParams.get("chat") || "enlarged";

  const restriction = useAppSelector(selectRestriction), dispatch = useAppDispatch(),
    restrictionManager = useRef(new RestrictionManager(dispatch));

  useEffect(() => {
    if (searchParams.has("pm") && !searchParams.has("aside", "enlarged")) {
      setSearchParams((params) => {
        params.set("aside", "enlarged");
        return params;
      });
    }
  }, [searchParams]);

  // NOTE: No need to clear the intervals and eventListeners on unmount because this component will always be on screen, can't anyways.
  const newRestrictionReset = useRef(false);
  useResourcesLoadedEffect(() => {
    const manager = restrictionManager.current;

    if (user?.email_verified) {
      if (restriction.started) {
        manager.startSpamCooldown(restriction.remaining);
        manager.startRestrictionResetCountdown(restriction.resetTime);
        newRestrictionReset.current = true;
      } else if (!newRestrictionReset.current && restriction.resetTime) {
        // resetTime can be set even if a restriction is not started.
        manager.startRestrictionResetCountdown(restriction.resetTime);
      }
    } else if (!user) {
      // Cleans up on logout.
      manager.cleanupAndUpdateTimes();
    }
  }, [user?.email_verified, restriction.started]);

  return (
    <m.div
      id="chat"
      className={s.chat}
      variants={shrinkInOut}
      initial="default"
      animate={chatState}
    >
      <div className={s.head}>
        <div className={s.inner} data-state={chatState}>
          <Button
            aria-label={chatState === "shrunk" ? "Enlarge Chat" : "Shrink Chat"}
            aria-controls="chat"
            aria-expanded={chatState === "enlarged"}
            size="lrg"
            iconBtn
            onClick={() =>
              setSearchParams((params) => {
                params.has("chat")
                  ? params.delete("chat", "shrunk")
                  : params.set("chat", "shrunk");
                return params;
              })
            }
          >
            <Icon id="expand-35" />
          </Button>
          <hgroup>
            <Icon aria-hidden="true" id="speech-bubble-24" />
            <h3 id="hChat">Chat</h3>
          </hgroup>
          {chatState === "enlarged" && (
            <Select
              // Default value instead of label.
              // label="Country"
              intent="primary"
              size="lrg"
              defaultValue="Global"
            >
              <option value="Global">Global</option>
              {/* ...the list of friends (use a prop).*/}
            </Select>
          )}
        </div>
        {chatState === "enlarged" && (
          <Blob svgWidth="155.361px" svgHeight="51.866px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 155.361 51.866"
              preserveAspectRatio="xMidYMin meet"
            >
              <path
                d="M72.245 2.489c22.276 0 38.993-5.6 59.085 0s19.252 10.71 21.282 22.4 9.311 18.482-13.161 24.362-40.03 0-70.285 0c-30.018 0-49.72 4.656-60.435 0C2.931 46.739 0 44.608 0 27.129 0 8.368.875 7.923 8.731 5.287 20.114 1.464 43.51 2.489 72.245 2.489Z"
                fill="#b243b2"
              />
            </svg>
          </Blob>
        )}
      </div>

      {chatState === "enlarged" && (
        <>
          <ChatMessages user={user} />

          <MessageInput user={user} asideState={asideState} />
        </>
      )}
    </m.div>
  );
}

function RoomSwitcher() {
  // TODO: List only online friends in the select, friends panel with all friends when expand.
  return null;
}
