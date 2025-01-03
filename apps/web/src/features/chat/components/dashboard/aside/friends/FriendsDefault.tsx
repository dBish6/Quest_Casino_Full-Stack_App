import type { FriendsProps } from "./Friends";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import type { AppDispatch } from "@redux/store";

import { type SetURLSearchParams, useSearchParams } from "react-router-dom";

import { useAppDispatch } from "@redux/hooks";
import { UPDATE_CHAT_ROOM } from "@chatFeat/redux/chatSlice";

import { ScrollArea } from "@components/scrollArea";
import { ModalTrigger } from "@components/modals";
import { Avatar, Link } from "@components/common";
import { Button } from "@components/common/controls";

import s from "../aside.module.css";

interface FriendsDisplayDefaultProps { 
  friend: FriendCredentials;
  setSearchParams: SetURLSearchParams;
  dispatch: AppDispatch
}

export interface FriendsDefaultProps extends Omit<FriendsProps, "asideState"> {}

/**
 * Used when the chat isn't enlarged, shown at the 'base' of the aside.
 */
export default function FriendsDefault({ user, friendsListArr }: FriendsDefaultProps) {
  const [_, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  return (
    <section className={s.friendsDefault}>
      <ModalTrigger query={{ param: "add" }} intent="primary">
        Add Friends
      </ModalTrigger>

      {!user ? (
        <p className={s.loginToSee}>
          <ModalTrigger query={{ param: "login" }} intent="primary">
            Login
          </ModalTrigger>{" "}
          to see friends.
        </p>
      ) : friendsListArr?.length ? (
        <ScrollArea orientation="vertical" className={s.friendsList}>
          <ul aria-label="Your Added Friends">
            {friendsListArr.map((friend) => (
              <FriendsDisplayDefault
                key={friend.member_id}
                friend={friend}
                dispatch={dispatch}
                setSearchParams={setSearchParams}
              />
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <p aria-label="No Friends Found" className={s.noFriends}>
          Meet people by playing some games! Or look through some{" "}
          <Link intent="primary" to={{ search: "?hs=Players" }}>
            suggested players
          </Link>
          .
        </p>
      )}
    </section>
  );
}

function FriendsDisplayDefault({ friend, setSearchParams, dispatch }: FriendsDisplayDefaultProps) {
  return (
    <li className={s.friend}>
      <Avatar size="lrg" user={friend} />
      <h4>{friend.username}</h4>
      <Link asChild to="">
        <Button
          aria-controls="asideDrawer"
          aria-haspopup="true"
          onClick={() => {
            dispatch(
              UPDATE_CHAT_ROOM({
                proposedId: friend.member_id,
                accessType: "private"
              })
            );

            setSearchParams((params) => {
              params.set("aside", "enlarged");
              return params;
            });
          }}
        >
          Message
        </Button>
      </Link>
    </li>
  )
}
