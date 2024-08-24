import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { MutationActionCreatorResult } from "@reduxjs/toolkit/query";
import type ChatMessage from "@chatFeat/typings/ChatMessage";

import React, { useRef, memo, useState, useMemo, useEffect } from "react";

import CircularQueue from "@chatFeat/utils/CircularQueue";

import useResourceLoader from "@hooks/useResourceLoader";
import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector } from "@redux/hooks";
import { selectGlobalRoomId } from "@chatFeat/redux/chatSelectors";
import { useManageChatRoomMutation, useChatMessageSentMutation } from "@chatFeat/services/chatApi";

import { Avatar } from "@components/common";
import { ModalQueryKey, ModalTrigger } from "@components/modals";
import { SkeletonAvatar, SkeletonText } from "@components/loaders";
import { ScrollArea } from "@components/scrollArea";

import s from "./chat.module.css";

interface ChatMessagesState {
  user: UserCredentials | null;
}

// Not important right now.
function VirtualizedList({ asChild }: { asChild: boolean }) {
  return null;
}

export default function ChatMessages({ user }: ChatMessagesState) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const conversationContainerRef = useRef<HTMLUListElement>(null),
    chatMsgs = useRef<CircularQueue | null>(null),
    [chatMsgCount, setChatMsgCount] = useState(0);
  
  const globalRoomId = useAppSelector(selectGlobalRoomId);

  const { resourcesLoaded } = useResourceLoader();

  const [emitManageChatRoom, {error: manageRoomError }] = useManageChatRoomMutation(),
    [chatMessageSentListener] = useChatMessageSentMutation(),
    [joinRoomLoading, setJoinRoomLoading] = useState(false);

  // NOTE: If user?.email_verified doesn't exist, it means they're logged out and all socket connections disconnect on logout, so no need to handle socket disconnections.
  useResourcesLoadedEffect(() => {
    if (user?.email_verified) {
      (async () => {
        setJoinRoomLoading(true);
        let listenMutation: MutationActionCreatorResult<any>;

        try {
          const joinMutation = emitManageChatRoom({
            action_type: "join",
            room_id: globalRoomId ?? null,
            ...(!globalRoomId && { country: user.country }),
          });
          const data = (await joinMutation).data;
          console.log("join data", data);
          if (data?.status === "ok" && data.chat_messages) {
            chatMsgs.current = new CircularQueue(data.chat_messages);
            setChatMsgCount(data.chat_messages.length);

            // Listens for new messages coming in.
            // TODO: Need to disconnect this when switching from global to private.
            listenMutation = chatMessageSentListener({
              resourcesLoaded,
              callback: (res) => {
                chatMsgs.current!.enqueue(res);
                setChatMsgCount((prev) => prev + 1);
              },
            })
            await listenMutation;
          }
  
          return () => [joinMutation, listenMutation].forEach((mutation) => mutation?.abort());
        } finally {
          setJoinRoomLoading(false);
        }
      })();
    }
  }, [user?.email_verified])

  const messageInputHeight = useRef(0);
  useEffect(() => {
    if (!joinRoomLoading && chatMsgCount) {
      const container = scrollContainerRef.current!.children.item(1)!;

      if (!messageInputHeight.current) 
        messageInputHeight.current = parseInt(
          window.getComputedStyle(container).getPropertyValue("--_inputHeight"), 
          10
        );

      container.scrollTo({ 
        top: container.scrollHeight - messageInputHeight.current,
        behavior: "smooth"
       })
    }
  }, [joinRoomLoading, chatMsgCount])

  useEffect(() => {
    if (manageRoomError) console.error("manageRoomError", manageRoomError);
  }, [manageRoomError])

  useEffect(() => {
    console.log("chatMsgCount", chatMsgCount);
  }, [chatMsgCount])
  
  // So it doesn't run the map again on whatever else.
  const initialChatMessages = useMemo(() => {
    console.log("useMemo chatMsgs.current", chatMsgs.current);
    const chatMsgsJSX: React.JSX.Element[] = [];
    let i = 0;
    for (const chatMsg of chatMsgs.current?.values() || []) {
      chatMsgsJSX.push(
        <ChatMessageBubble key={`${chatMsg.username} ${i}`} user={user} chatMsg={chatMsg}/>
      );
      i++;
    }

    return chatMsgsJSX;
  }, [chatMsgCount]);

  return (
    <ScrollArea
      ref={scrollContainerRef}
      role="log"
      orientation="vertical"
      className={s.chatMessages}
    >
      {user ? (
        joinRoomLoading ? (
          <ul
            role="status"
            aria-label="Loading Chat Conversation"
            className={s.skeleton}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <ChatMessageBubble key={i} user={null} chatMsg={null} />
            ))}
          </ul>
        ) : !chatMsgCount ? (
          <p>Empty chat room.</p>
        ) : (
          <>
            <ul
              ref={conversationContainerRef}
              aria-roledescription="chat conversation"
              className={s.conversation}
            >
              {initialChatMessages}
            </ul>
          </>
        )
      ) : (
        <p>
          <ModalTrigger queryKey={ModalQueryKey.LOGIN_MODAL} intent="primary">
            Login
          </ModalTrigger>{" "}
          to see the chat.
        </p>
      )}
    </ScrollArea>
  );
}

// TODO: Have it like ChatMessageBubble.global and ChatMessageBubble.private?
const ChatMessageBubble = memo(({ user, chatMsg }: { user: UserCredentials | null; chatMsg: ChatMessage | null }) => {
  return (
    <>
      <li className={s[`message${!chatMsg ? "Skeleton" : ""}`]}>
        <div
          className={s.info}
          {...(chatMsg?.username === user?.username && { "data-user": "" })}
        >
          <div className={s.nameAva}>
          {chatMsg ? (
              <>
                <Avatar user={{ avatar_url: chatMsg.avatar_url }} />
                <h4>{chatMsg?.username === user?.username ? "You" : chatMsg.username}</h4>
              </>
            ) : (
              <>
                <SkeletonAvatar size="sm" />
                <SkeletonText
                  size="paraXxSmall"
                  style={{ width: Math.floor(Math.random() * 2) ? "28px" : "39px" }}
                />
              </>
            )}
          </div>

          {chatMsg ? (
            <time dateTime={chatMsg.created_at}>
              {new Date(chatMsg.created_at).toLocaleString("en-CA", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </time>
          ) : (
            <SkeletonText size="paraXxSmall" className={s.timeSkel} />
          )}
        </div>
        {chatMsg ? (
          <p>{chatMsg.message}</p>
        ) : (
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonText
              key={i}
              size="paraXSmall"
              className={s.paraSkel}
              {...(i === 2 && {
                style: { width: Math.floor(Math.random() * 2) ? "30%" : "55%" },
              })}
            />
          ))
        )}
      </li>
    </>
  );
});
