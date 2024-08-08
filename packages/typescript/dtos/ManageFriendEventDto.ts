import type { FriendCredentials, MinUserCredentials } from "../typings/UserCredentials";

// TODO: Not used at the moment.
export interface FriendRoomEventDto {
  action_type: "join" | "leave";
  friend: FriendCredentials
}

export interface ManageFriendRequestEventDto {
  action_type: "request" | "add" | "decline";
  // friend: { username: string };
  friend: MinUserCredentials | FriendCredentials;
}
