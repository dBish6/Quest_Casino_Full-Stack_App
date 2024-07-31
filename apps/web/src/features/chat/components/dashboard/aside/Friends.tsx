import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useInitializeFriendsMutation } from "@authFeat/services/authApi";

import { ScrollArea } from "@components/scrollArea";
import { Avatar, Link } from "@components/common";
import { ModalQueryKey, ModalTrigger } from "@components/modals";

import s from "./aside.module.css";

export default function Friends({ user }: { user: UserCredentials | null }) {
  const [emitInitFriends, { data, error: friendsError, isLoading: friendsLoading, isSuccess: friendsSuccess }] = useInitializeFriendsMutation(),
    friends = user?.friends.list || [];
  
  useResourcesLoadedEffect(() => {
      const mutation = emitInitFriends({ friends })
      mutation.then((res) => {
        console.log("res.data", res.data)
      })

      return () => mutation.abort();
  }, [])

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
                user={friend}
              />
              <h4>{friend.username}</h4>
              <Link to={{ search: `?pm=${friend.username}` }}>Message</Link>
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
