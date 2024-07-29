import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import { useEffect } from "react";

import { useInitializeFriendsMutation } from "@authFeat/services/authApi";

import useResourceLoader from "@hooks/useResourceLoader";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link } from "@components/common";
import { ModalQueryKey, ModalTrigger } from "@components/modals";

import s from "./aside.module.css";

export default function Friends({ user }: { user: UserCredentials | null }) {
  const { resourcesLoaded } = useResourceLoader()

  const [emitInitFriends, { data, error: friendsError, isLoading: friendsLoading, isSuccess: friendsSuccess }] = useInitializeFriendsMutation(),
    friends = user?.friends.list || [];
  
  useEffect(() => {
    if (resourcesLoaded) {
      const mutation = emitInitFriends({ friends })
      mutation.then((res) => {
        console.log("res.data", res.data)
      })

      return () => mutation.abort();
    }
  }, [resourcesLoaded])

  return (
    <div className={s.friends}>
      <ModalTrigger queryKey={ModalQueryKey.ADD_FRIENDS_MODAL} intent="primary">
            Add Friends
      </ModalTrigger>

      {friends.length ? (
        <ScrollArea orientation="vertical">
          {friends.map((friend, i) => (
            <div key={i} className={s.friend}>
              <Avatar
                size="lrg"
                user={{ avatar_url: friend.avatar_url || "" }}
                showProfile={false}
              />
              <h4>{friend.username}</h4>
              <Link
                // intent="primary"
                to={{ search: `?pm=${friend.username}` }}
              >
                Message
              </Link>
            </div>
          ))}
        </ScrollArea>
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
