import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import { useMemo } from "react"

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link } from "@components/common";
import { ModalQueryKey, ModalTrigger } from "@components/modals";

import s from "./aside.module.css";

export default function Friends({ user }: { user: UserCredentials | null }) {
  const friendsListArr = useMemo(() => Object.values(user?.friends.list || {}), [user?.friends.list]);

  return (
    <div className={s.friends}>
      <ModalTrigger queryKey={ModalQueryKey.ADD_FRIENDS_MODAL} intent="primary">
        Add Friends
      </ModalTrigger>

      {friendsListArr.length ? (
        <ScrollArea orientation="vertical">
          <>
            {friendsListArr.map((friend, i) => (
              <div key={i} className={s.friend}>
                <Avatar
                  size="lrg"
                  user={friend}
                />
                <h4>{friend.username}</h4>
                <Link to={{ search: `?pm=${friend.username}` }}>Message</Link>
              </div>
            ))}
            <FriendsSkeleton />
          </>
        </ScrollArea>
      ) : user?.verification_token ? (
        <FriendsSkeleton />
      ) : (
        <p aria-label="No Friends Found">
          Meet people by playing some games! Or look through some{" "}
          {/* TODO: Link. */}
          <Link intent="primary" to={{ search: "?players=true" }}>
            suggested players
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function FriendsSkeleton() {
  return null
}
