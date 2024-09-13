import type { Variants } from "framer-motion";
import type { UserCredentials, FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import type { DragPointsKey } from "../Aside";
import type { AppDispatch } from "@redux/store";
import type ChatRoomAccessType from "@qc/typescript/typings/ChatRoomAccessType";

import { useSearchParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { m } from "framer-motion";

import RestrictionManager from "@chatFeat/utils/RestrictionManager";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectRestriction, selectChatRoom } from "@chatFeat/redux/chatSelectors";
import { UPDATE_CHAT_ROOM } from "@chatFeat/redux/chatSlice";

import { Button, Select } from "@components/common/controls";
import { Icon, Blob } from "@components/common";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { FriendsPanel } from "../Friends";
import { ANIMATION_DURATION } from "../Aside";

import s from "./chat.module.css";

interface RoomSwitcherProps {
  user: UserCredentials | null;
  friendsListArr: FriendCredentials[];
  chatState: ChatPointsKey;
  dispatch: AppDispatch;
}

interface ChatProps {
  user: UserCredentials | null;
  friendsListArr: FriendCredentials[];
  asideState: DragPointsKey;
}

type ChatPointsKey = "full" | "enlarged" | "shrunk";

const shrinkInOut: Variants = {
  full: {
    height: "100%",
    transition: { duration: 0 }
  },
  enlarged: {
    height: "89%",
    transition: { type: "spring", duration: 0.85 },
  },
  shrunk: {
    height: "81.2px",
    transition: { type: "spring", duration: 0.85 },
  },
};

export default function Chat({ user, friendsListArr, asideState }: ChatProps) {
  const [searchParams, setSearchParams] = useSearchParams(),
    chatState = searchParams.get("chat") || "enlarged";

  // TODO: Change name to chatPoint idk
  const [chat, setChat] = useState<ChatPointsKey>(chatState as ChatPointsKey);

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

  // TODO: Don't know about the transitioning yet.
  const prev = useRef("");
  useEffect(() => {
    if (asideState === "enlarged") {
      setChat("full");
    } else if (prev.current === "enlarged") {
      setTimeout(() => setChat(chatState as ChatPointsKey), ANIMATION_DURATION - 350);
    } else {
      // setChat(asideState === "enlarged" ? "full" : chatState as ChatPointsKey);
      setChat(chatState as ChatPointsKey);
    }

    prev.current = asideState;
  }, [asideState, chatState]);

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
    <>
      {asideState === "enlarged" && <FriendsPanel user={user} friendsListArr={friendsListArr} />}

      <m.section
        id="chat"
        className={s.chat}
        variants={shrinkInOut}
        initial="default"
        animate={chat}
        data-aside-state={asideState}
      >
        <div className={s.head}>
          <div className={s.inner} data-chat-state={chat}>
            {chat !== "full" && (
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
            )}
            <hgroup>
              <Icon aria-hidden="true" id={`speech-bubble-${chat === "full" ? "32" : "24"}`} />
              <h3 id="hChat">Chat</h3>
            </hgroup>

            <RoomSwitcher user={user} friendsListArr={friendsListArr} chatState={chat} dispatch={dispatch} />
          </div>
          
          {chat !== "shrunk" && (
            <Blob svgWidth={chat === "full" ? "193.73px" : "155.361px"} svgHeight={chat === "full" ? "54.16px" : "51.866px"}>
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

        {/* FIXME: Very weird problem when ChatMessages rendered and going to asideState shrunk. */}
        {(chatState !== "shrunk" || asideState === "enlarged") && (
          <>
            <ChatMessages user={user} asideState={asideState} />
            <MessageInput user={user} asideState={asideState} />
          </>
        )}
      </m.section>
    </>
  );
}

function RoomSwitcher({ user, chatState, friendsListArr, dispatch }: RoomSwitcherProps) {
  const selectRef = useRef<HTMLSelectElement>(null),
    chatRoom = useAppSelector(selectChatRoom);

  /**
   * If there is a user and verified, this sets the initial proposedId for the chat, which is then used to
   * request and set the currentId.
   */
  useResourcesLoadedEffect(() => {
    if (user?.email_verified && chatState !== "shrunk" && !chatRoom.proposedId) {
      dispatch(UPDATE_CHAT_ROOM({ proposedId: user.country }));
    }
  }, [user?.email_verified, chatState]);

  /**
   * Handles switching between chat rooms using either the buttons or the select. Updates the `proposedId` and `accessType` state.
   */
  const handleSwitch = {
    button: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const btnText = e.currentTarget.innerText!.toLowerCase() as ChatRoomAccessType;

      dispatch(
        UPDATE_CHAT_ROOM({
          ...(btnText === "global"
            ? { proposedId: user!.country }
            : {
                ...(chatRoom.targetFriend?.verTokenSnapshot
                  ? { proposedId: chatRoom.targetFriend.verTokenSnapshot }
                  : { proposedId: null, currentId: null }),
              }),
          accessType: btnText
        })
      );
    },
    select: (e: React.FormEvent<HTMLSelectElement>) => {
      const target = e.currentTarget,
        selectedOpt = target.options[target.selectedIndex];

      dispatch(
        UPDATE_CHAT_ROOM({
          proposedId: selectedOpt.value,
          accessType: selectedOpt.innerText === "Global" ? "global" : "private"
        })
      );
    }
  }

  return chatState === "full" ? (
    <div className={s.roomBtns}>
      {["Private", "Global"].map((txt) => {
        const current = chatRoom.accessType === txt.toLowerCase();

        return (
          <Button
            key={txt}
            aria-label={`Switch to ${txt} chat room.`}
            aria-controls="chatMsgs"
            intent="chip"
            size="md"
            {...(user
              ? {
                  "aria-pressed": current,
                  disabled: chatRoom.loading || current,
                  onClick: (e) => handleSwitch.button(e)
                }
              : { disabled: true })}
          >
            {txt}
          </Button>
        );
      })}
    </div>
  ) : (
    chatState === "enlarged" && (
      <Select
        ref={selectRef}
        aria-controls="chatMsgs"
        label="Select a Chat Room"
        hideLabel
        intent="primary"
        size="lrg"
        id="chatRoomSelect"
        disabled={chatRoom.loading}
        value={chatRoom.proposedId || ""}
        onInput={(e) => handleSwitch.select(e)}
      >
        {user?.email_verified && <option value={user.country}>Global</option>}
        {friendsListArr.map((friend) => {
          const status = friend.activity.status,
            verToken = friend.verification_token;

          return (
            <option key={verToken} value={verToken}>
              <span aria-label={status} className={s.activityIndie} data-status={status || "offline"} />
              {friend.username}
            </option>
          );
        })}
      </Select>
    )
  );
}
