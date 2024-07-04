import type { UserCredentials, FriendCredentials } from "@qc/typescript/typings/UserCredentials";

import { useState } from "react";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link } from "@components/common";

import s from "./aside.module.css";

export default function Friends({ user }: { user: UserCredentials | null }) {
  const [friends, setFriends] = useState<FriendCredentials[]>(user?.friends || []);

  return (
    <div className={s.friends}>
      {/* TODO: Add friends modal. */}
      <Link intent="primary" to={{ search: "?add=true" }} className={s.add}>
        Add Friends
      </Link>
      <ScrollArea orientation="vertical">
        {user && <div>{user.legal_name.first}</div>}
        {friends?.length ? (
          friends.map((friend, i) => (
            <div key={i} className={s.friend}>
              <Avatar
                size="lrg"
                user={{ avatar_url: friend.avatar_url || "" }}
                showProfile={false}
              />
              {/* TODO: Idk if this should be a heading. */}
              <h4>{friend.username}</h4>
              <Link intent="primary" to={{ search: `?pm=${friend.username}` }}>
                Message
              </Link>
            </div>
          ))
        ) : (
          <p>
            Meet people by playing some games! Or look through some{" "}
            <Link intent="primary" to={{ search: "?players=true" }}>
              suggested players
            </Link>
            .
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
