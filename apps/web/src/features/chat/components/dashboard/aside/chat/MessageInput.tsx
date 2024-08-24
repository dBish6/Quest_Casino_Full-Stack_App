import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import { useRef, useEffect } from "react";

import { debounce } from "tiny-throttle";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectGlobalRoomId, selectRestriction } from "@chatFeat/redux/chatSelectors";
import { TOGGLE_RESTRICTION, UPDATE_RESTRICTION_TIME, RESTRICTION_RESET_TIME_ELAPSED } from "@chatFeat/redux/chatSlice";
// Typing might be here because it will be in the same div (Form right now)...?
import { useTypingMutation, useTypingActivityMutation, useChatMessageMutation } from "@chatFeat/services/chatApi";

import { Button, Input } from "@components/common/controls";
import { Icon } from "@components/common";
import { Form } from "@components/form";

import s from "./chat.module.css";

interface MessageInputProps { 
  user: UserCredentials | null; 
  asideState: string | null;
}

export default function MessageInput({ user, asideState }: MessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const globalRoomId = useAppSelector(selectGlobalRoomId),
    restriction = useAppSelector(selectRestriction),
    dispatch = useAppDispatch();

  const [emitChatMessage, { error: emitChatMessageError }] = useChatMessageMutation();

  useEffect(() => {
    if (emitChatMessageError) console.error("emitChatMessageError", emitChatMessageError);
  }, [emitChatMessageError])

  // useResourcesLoadedEffect(() => {
  //   console.log("restriction", restriction);
  //   console.log("restriction globalRoomId", !globalRoomId);
  // }, [restriction, globalRoomId])

  const debouncedSendChatMessage = debounce(async () => {
    const message = inputRef.current!.value.trim();

    if (globalRoomId && message) {
      const res = await emitChatMessage({
        room_id: globalRoomId,
        avatar_url: user!.avatar_url,
        username: user!.username,
        message: inputRef.current!.value,
        // created_at: new Date().toUTCString()
        created_at: new Date().toISOString(),
        // created_at: new Date().toLocaleTimeString()
      });

      const data = res.data;
      if (data?.status === "ok") {
        // 
      } else if (data?.status === "bad request") {
        // Too many duplicate messages (restrict on spam).
        dispatch(TOGGLE_RESTRICTION(true));
      }
    }
  }, 700);
 
  const handleSendChatMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debouncedSendChatMessage()
  };

  // console.log("globalRoomId", globalRoomId, "restriction.started", restriction.started);

  return (
    <Form
      onSubmit={handleSendChatMessage}
    >
      <Input
        ref={inputRef}
        label="Message"
        intent="primary"
        size="lrg"
        id="message"
        Button={() => (
          <Button
            intent="primary"
            size={asideState === "enlarged" ? "xl" : "lrg"}
            iconBtn
            disabled={!globalRoomId || restriction.started}
          >
            <Icon id={asideState === "enlarged" ? "send-24" : "send-18"} />
          </Button>
        )}
        // user here is useUser and it's undefined on the server and loaded on the client, so user helps with hydration issues also.
        error={user && restriction.started && (() => (
          <>
            Restriction expires in:{" "}
            <span id="coolCounter"></span>
          </>
        ))}
        // FIXME: Actually wtf.
        // disabled={!globalRoomId || restriction.started}
      />
    </Form>
  );
}