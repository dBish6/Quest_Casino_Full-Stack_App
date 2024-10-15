import type { FriendsProps } from "./Friends";
import type { FriendCredentials } from "@qc/typescript/typings/UserCredentials";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link } from "@components/common";
import { ModalTrigger } from "@components/modals";

import s from "../aside.module.css";

export interface FriendsDefaultProps extends Omit<FriendsProps, "asideState"> {}

/**
 * Used when the chat isn't enlarged, shown at the 'base' of the aside.
 */
export default function FriendsDefault({ user, friendsListArr }: FriendsDefaultProps) {
  return (
    <section className={s.friendsDefault}>
      <ModalTrigger queryKey="add" intent="primary">
        Add Friends
      </ModalTrigger>

      {!user ? (
        <span style={{ alignSelf: "center", textAlign: "center" }}>
          <ModalTrigger queryKey="login" intent="primary">
            Login
          </ModalTrigger>{" "}
          to see friends.
        </span>
      ) : friendsListArr?.length ? (
        <ScrollArea orientation="vertical" className={s.friendsList}>
          <ul aria-label="Your Added Friends">
            {friendsListArr.map((friend) => (
              <FriendsDisplayDefault key={friend.verification_token} friend={friend} />
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <p aria-label="No Friends Found">
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

function FriendsDisplayDefault({ friend }: { friend: FriendCredentials }) {
  return (
    <li className={s.friend}>
      <Avatar size="lrg" user={friend} />
      <h4>{friend.username}</h4>
      <Link to={{ search: `?pm=${friend.verification_token}` }}>
        Message
      </Link>
    </li>
  )
}
