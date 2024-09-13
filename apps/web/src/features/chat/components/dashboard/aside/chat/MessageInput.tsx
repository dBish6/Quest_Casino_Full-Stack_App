import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { DragPointsKey } from "../Aside";

import { useRef } from "react";
import { debounce } from "tiny-throttle";

import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectChatRoom, selectRestriction } from "@chatFeat/redux/chatSelectors";
import { TOGGLE_RESTRICTION } from "@chatFeat/redux/chatSlice";
// TODO: (Only do it for private) Typing might be here because it will be in the same div (Form right now)...?
import { useTypingMutation, useTypingActivityMutation, useChatMessageMutation } from "@chatFeat/services/chatApi";

import { Button, Input } from "@components/common/controls";
import { Icon } from "@components/common";
import { Form } from "@components/form";

// import s from "./chat.module.css";

interface MessageInputProps { 
  user: UserCredentials | null; 
  asideState: DragPointsKey;
}

export default function MessageInput({ user, asideState }: MessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const chatRoom = useAppSelector(selectChatRoom),
    restriction = useAppSelector(selectRestriction),
    dispatch = useAppDispatch();

  const [emitChatMessage, { isLoading: emitChatMessageLoading, error: emitChatMessageError }] = useChatMessageMutation(),
    disableInput = chatRoom.loading || !chatRoom.currentId || emitChatMessageLoading || restriction.started;

  const debouncedSendChatMessage = debounce(async () => {
    const message = inputRef.current!.value.trim();

    if (chatRoom.currentId && message) {
      const res = await emitChatMessage({
        room_id: chatRoom.currentId,
        avatar_url: user!.avatar_url,
        username: user!.username,
        message: inputRef.current!.value
      });

      console.log("res.data!", res.data)
      if (res.data?.status === "ok") {
        inputRef.current!.value = "";
      } else if (isFetchBaseQueryError(res.error) && (res.error?.status as string) === "bad request") {
        // Too many duplicate messages (restrict on spam).
        dispatch(TOGGLE_RESTRICTION(true));
      }
    }
  }, 700),
    handleSendChatMessage = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      debouncedSendChatMessage()
    };

  return (
    <Form onSubmit={handleSendChatMessage}>
      <Input
        ref={inputRef}
        label="Message"
        intent="primary"
        size={asideState === "enlarged" ? "xl" : "lrg"}
        id="messenger"
        Button={() => (
          <Button
            intent="primary"
            size={asideState === "enlarged" ? "xl" : "lrg"}
            iconBtn
            disabled={disableInput}
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
        disabled={disableInput}
      />
    </Form>
  );
}