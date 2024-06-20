// import {
//     useGetFriendsQuery,
//   } from "@authFeat/services/authApi";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link } from "@components/common";

import jamieButler from "/images/jamie-butler.webp";
import larissaRebekka from "/images/larissa-rebekka.webp";
import chrisSimpson from "/images/chris-simpson.webp";
import isaacBerthild from "/images/isaac-berthild.webp";
import muggsyBogues from "/images/muggsy-bogues.webp";

import s from "./aside.module.css";

const MockUsers = [
  {
    avatarUrl: jamieButler,
    username: "username1",
  },
  {
    avatarUrl: larissaRebekka,
    username: "username2",
  },
  {
    avatarUrl: chrisSimpson,
    username: "username3",
  },
  {
    avatarUrl: isaacBerthild,
    username: "username4",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username4",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username5",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username6",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username7",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username8",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username9",
  },
  {
    avatarUrl: muggsyBogues,
    username: "username10",
  },
];

export default function Friends() {
  return (
    <div className={s.friends}>
      {/* TODO: Add friends modal. */}
      <Link intent="primary" to={{ search: "?add=true" }} className={s.add}>
        Add Friends
      </Link>
      <ScrollArea orientation="vertical">
        {MockUsers.length ? (
          MockUsers.map((friend, i) => (
            <div key={i} className={s.friend}>
              <Avatar
                size="lrg"
                user={{ avatar_url: friend.avatarUrl }}
                showProfile={false}
              />
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
