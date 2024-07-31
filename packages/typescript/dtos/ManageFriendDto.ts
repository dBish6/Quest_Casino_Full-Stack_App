import type { FriendCredentials } from "../typings/UserCredentials";

export interface ManageFriendRoomDto {
  action_type: "join" | "leave";
  friend: FriendCredentials
}

export interface ManageFriendRequestDto {
  action_type: "request" | "add" | "decline";
  friend: { username: string };
}
