import type { UserCredentials, FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import type { ChatRoomState } from "@chatFeat/redux/chatSlice";
import type { AppDispatch } from "@redux/store";

import { useSearchParams } from "react-router-dom";
import { useRef, useState, useMemo, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectChatRoom } from "@chatFeat/redux/chatSelectors";
import { UPDATE_USER_FRIEND_IN_LIST } from "@authFeat/redux/authSlice";
import { UPDATE_CHAT_ROOM, UPDATE_TARGET_FRIEND } from "@chatFeat/redux/chatSlice";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link, Blob, Icon } from "@components/common";
import { ModalQueryKey, ModalTrigger } from "@components/modals";
import { Form } from "@components/form";
import { Input } from "@components/common/controls";
import Timestamp from "./Timestamp";

import s from "./aside.module.css";

interface FriendsProps {
  user: UserCredentials | null;
  friendsListArr: FriendCredentials[];
}

interface FriendsPanelProps extends FriendsProps {}

interface FriendsDisplayProps {
  type: "list" | "chat" | "chat prev";
  friend: FriendCredentials;
  prevChatMessage?: string;
  targetFriend?: ChatRoomState["targetFriend"];
  dispatch?: AppDispatch;
}

/**
 * Used when the chat isn't enlarged, shown at the 'base' of the aside.
 */
export default function Friends({ user, friendsListArr }: FriendsProps) {
  return (
    <section className={s.friends}>
      <ModalTrigger queryKey={ModalQueryKey.ADD_FRIENDS_MODAL} intent="primary">
        Add Friends
      </ModalTrigger>

      {!user ? (
        <span style={{ alignSelf: "center", textAlign: "center" }}>
          <ModalTrigger queryKey={ModalQueryKey.LOGIN_MODAL} intent="primary">
            Login
          </ModalTrigger>{" "}
          to see friends.
        </span>
      ) : friendsListArr?.length ? (
        <ScrollArea orientation="vertical" className={s.friendsList}>
          <ul aria-label="Your Added Friends">
            {friendsListArr.map((friend) => (
              <FriendDisplay key={friend.verification_token} type="list" friend={friend} />
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <p aria-label="No Friends Found">
          Meet people by playing some games! Or look through some{" "}
          {/* TODO: Link in home. */}
          <Link intent="primary" to={{ search: "?players=true" }}>
            suggested players
          </Link>
          .
        </p>
      )}
    </section>
  );
}

/**
 * Used with enlarged chat.
 */
export function FriendsPanel({ user, friendsListArr }: FriendsPanelProps) {
  const [searchParams] = useSearchParams();

  const chatRoom = useAppSelector(selectChatRoom),
    dispatch = useAppDispatch();

  const friendsWithPrevChatsArr = useMemo(
    () => friendsListArr.filter((friend) => friend.last_chat_message !== undefined),
    [friendsListArr]
  );

  const [search, setSearch] = useState<{
    start: boolean;
    results: FriendCredentials[];
  }>({ start: false, results: [] });

  const mergedFriendsArr = useRef<FriendCredentials[]>([]);
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget.elements[0] as HTMLInputElement).value;

    if (value.trim().length > 0) {
      if (!search.start)
        mergedFriendsArr.current = [...friendsListArr, ...friendsWithPrevChatsArr]

      const results = mergedFriendsArr.current.filter((friend) =>
        friend.username.toLowerCase().includes(value.toLowerCase())
      );
      setSearch({ start: true, results });
    } else {
      setSearch({ start: false, results: [] });
      mergedFriendsArr.current = []
    }
  }

  /**
   * On `re-direct`. 
   */
  useEffect(() => {
    if (user && searchParams.get("pm")) {
      const verToken = searchParams.get("pm")!;

      dispatch(UPDATE_TARGET_FRIEND({
        verTokenSnapshot: user.friends.list[verToken].verification_token,
        friend: user.friends.list[verToken],
      }));
    }
  }, [searchParams]);
  /** 
   * Updates target friend on joins or leaves (currentId), the verTokenSnapshot is used with the `RoomSwitcher` buttons.
   */
  useEffect(() => {
    if (user && chatRoom.currentId) {
      if (chatRoom.accessType === "private") {
        const friend = user.friends.list[chatRoom.proposedId!];

        dispatch(UPDATE_TARGET_FRIEND({
          verTokenSnapshot: friend.verification_token,
          friend: friend
        }));
      } else {
        dispatch(UPDATE_TARGET_FRIEND({ friend: null }));
      }
    }
  }, [chatRoom.currentId]);

  /**
   * Updates the friend's last message in the current user's friend list if the target switches or the component un-mounts.
   */
  useEffect(() => {
    if (chatRoom.targetFriend?.friend && chatRoom.accessType === "private") {
      const updateFriendPrevChatMsg = () => {
        if (chatRoom.lastChatMessage)
          dispatch(
            UPDATE_USER_FRIEND_IN_LIST({
              verToken: chatRoom.targetFriend!.friend!.verification_token,
              update: { last_chat_message: chatRoom.lastChatMessage.message },
            })
          );
      }
      updateFriendPrevChatMsg();

      return () => updateFriendPrevChatMsg();
    }
  }, [chatRoom.targetFriend?.friend]);
  
  return (
    <section className={s.friendsPanel}>
      {chatRoom.targetFriend?.friend && (
        <Blob svgWidth="220.83px" svgHeight="169.179px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 220.83 169.179"
            preserveAspectRatio="xMidYMin meet"
          >
            <path
              d="M60.948.044C144.617 2.63 224.816-11.08 217.212 39.866s26.97 89.089-29.53 126.707c-32.606 1.552-36.1-2.081-83.159-4.867s-56.909 25.769-82.672-13.307S-22.721-2.542 60.948.044Z"
              fill="rgba(178,67,178,0.6)"
            />
          </svg>
        </Blob>
      )}
      <div className={s.inner} role="group" aria-roledescription="chat room management">
        {user && (
          <>
            <header className={s.targetFriend}>
              {chatRoom.accessType === "private" && (
                <>
                  <Avatar
                    size="xxl"
                    {...(user && { user: { avatar_url: user.avatar_url } })}
                  />

                  <hgroup
                    {...(chatRoom.targetFriend?.friend
                      ? {
                          role: "group",
                          "aria-roledescription": "heading group",
                          "aria-label": "Selected Recipient",
                        }
                      : {
                          "aria-label":
                            "Select a Recipient to Start a Conversation",
                        })}
                    id="targetFriendDetails"
                    className={s.details}
                  >
                    {chatRoom.targetFriend?.friend ? (
                      <>
                        <h3>{chatRoom.targetFriend.friend.username}</h3>
                        <p aria-roledescription="subtitle">
                          {chatRoom.targetFriend.friend.legal_name.first} {chatRoom.targetFriend.friend.legal_name.last}
                        </p>
                      </>
                    ) : (
                      <h3>Select a Recipient</h3>
                    )}
                  </hgroup>

                  <span className={s.divider} />
                </>
              )}
            </header>

            <Form onSubmit={(e) => handleSearch(e)}>
              <Input
                aria-label="Search for Friends or Previous Chats"
                aria-controls="searchResults"
                aria-expanded={search.start}
                label="Search"
                intent="primary"
                size="lrg"
                id="searchFriends"
                Icon={() => <Icon id="search-18" />}
                onInput={(e) => {
                  if (!e.currentTarget.value.length) setSearch((prev) => ({ ...prev, start: false }));
                }}
              />
            </Form>
            <div className={s.lists} aria-live="polite" data-friend-targeted={!!chatRoom.targetFriend?.friend}>
              {search.start ? (
                <ScrollArea orientation="vertical" id="searchResults" className={s.searchResults}>
                  <ul>
                    {!search.results.length ? (
                      <p className={s.noResults}>No Results</p>
                    ) : (
                      <ul>
                        {search.results.map((friend) => (
                          <FriendDisplay
                            key={friend.verification_token}
                            type="chat"
                            friend={friend}
                            targetFriend={chatRoom.targetFriend}
                            dispatch={dispatch}
                          />
                        ))}
                      </ul>
                    )}
                  </ul>
                </ScrollArea>
              ) : (
                <>
                  <section className={s.prevChatsContainer}>
                    <h4 className="hUnderline">Previous Chats</h4>

                    <ScrollArea orientation="vertical" className={s.prevChats}>
                      {!friendsWithPrevChatsArr.length ? (
                        <p className={s.noResults}>No Results</p>
                      ) : (
                        <ul>
                          {friendsWithPrevChatsArr.map((friend) => (
                            <FriendDisplay
                              key={friend.verification_token}
                              type="chat prev"
                              friend={friend}
                              targetFriend={chatRoom.targetFriend}
                              dispatch={dispatch}
                            />
                          ))}
                        </ul>
                      )}
                    </ScrollArea>
                  </section>

                  <hr className={s.divider} />

                  <section className={s.friendsListContainer}>
                    <h4 className="hUnderline">Friends</h4>

                    <ScrollArea
                      orientation="vertical"
                      className={s.friendsList}
                    >
                      {!friendsListArr.length ? (
                        <p className={s.noResults}>No Results</p>
                      ) : (
                        <ul>
                          {friendsListArr.map((friend) => (
                            <FriendDisplay
                              key={friend.verification_token}
                              type="chat"
                              friend={friend}
                              targetFriend={chatRoom.targetFriend}
                              dispatch={dispatch}
                            />
                          ))}
                        </ul>
                      )}
                    </ScrollArea>
                  </section>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FriendDisplay({ type, friend, targetFriend, dispatch }: FriendsDisplayProps) {
  const { status, inactivity_timestamp: timestamp } = friend.activity,
    isTarget = friend.verification_token === targetFriend?.friend?.verification_token;

  return (
    <>
      {type === "list" ? (
        <li className={s.friend}>
          <Avatar size="lrg" user={friend} />
          <h4>{friend.username}</h4>
          <Link to={{ search: `?pm=${friend.verification_token}` }}>
            Message
          </Link>
        </li>
      ) : (
        <li className={s.friend} data-target={isTarget}>
          <Avatar size="md" user={friend} />
          
          {type === "chat prev" ? (
            <button
              {...(!isTarget && { title: "Enter Previous Chat Conversation" })}
              aria-label={`Enter Previous Chat Conversation With ${friend.username}`}
              aria-pressed={isTarget}
              aria-controls="targetFriendDetails"
              aria-expanded={!!targetFriend?.friend}
              onClick={() => {
                dispatch!(UPDATE_CHAT_ROOM({ proposedId: friend.verification_token, accessType: "private" }))
              }}
              disabled={isTarget}
            >
              <div>
                <h5>{friend.username}</h5>
                <Timestamp activity={{ status, timestamp }} prefix />
              </div>

              <p>{friend.last_chat_message || `Introduce yourself to ${friend.username}!`}</p>
            </button>
          ) : (
            <button
              {...(!isTarget && { title: "Start or Enter Previous Chat Conversation" })}
              // TODO: Idk if this is going to become too wordy.
              aria-label={`Start a New Chat Conversation With ${friend.username}`}
              aria-pressed={isTarget}
              aria-controls="targetFriendDetails"
              aria-expanded={!!targetFriend?.friend}
              onClick={() => {
                dispatch!(UPDATE_CHAT_ROOM({ proposedId: friend.verification_token, accessType: "private" }))
                
                if (!friend.last_chat_message)
                  dispatch!(
                    UPDATE_USER_FRIEND_IN_LIST({
                      verToken: friend.verification_token,
                      update: { last_chat_message: "" },
                    })
                  );
              }}
              disabled={isTarget}
            >
              <h5>{friend.username}</h5>
              <Timestamp activity={{ status, timestamp }} prefix />
            </button>
          )}
        </li>
      )}
    </>
  );
}
