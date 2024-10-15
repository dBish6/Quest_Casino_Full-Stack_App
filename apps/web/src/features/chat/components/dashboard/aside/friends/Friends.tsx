import type { UserCredentials, FriendCredentials } from "@qc/typescript/typings/UserCredentials";
import type { DragPointsKey } from "../Aside";

import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@redux/hooks";
import { selectChatRoom } from "@chatFeat/redux/chatSelectors";
import { UPDATE_USER_FRIEND_IN_LIST } from "@authFeat/redux/authSlice";
import { UPDATE_TARGET_FRIEND } from "@chatFeat/redux/chatSlice";

import FriendsDefault from "./FriendsDefault";
import FriendsEnlarged from "./FriendsEnlarged";

export interface FriendsProps {
  user: UserCredentials | null;
  asideState: DragPointsKey;
  friendsListArr: FriendCredentials[];
}

export default function Friends({ user, asideState, friendsListArr }: FriendsProps) {
  const [searchParams] = useSearchParams();

  const chatRoom = useAppSelector(selectChatRoom),
    dispatch = useAppDispatch();

  /**
   * On `re-direct`. 
   */
  useEffect(() => {
    if (user) {
      const verToken = searchParams.get("pm")!;
      if (verToken)
        dispatch(UPDATE_TARGET_FRIEND({
          verTokenSnapshot: user.friends.list[verToken].verification_token,
          friend: user.friends.list[verToken],
        }));
    }
  }, [searchParams.get("pm")]);
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

  const props = { user, friendsListArr, ...(asideState === "enlarged" && { chatRoom }) } as any;
  return asideState === "enlarged" ? <FriendsEnlarged {...props} /> : <FriendsDefault {...props} />
}
