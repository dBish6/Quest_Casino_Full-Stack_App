import type { FriendCredentials, MinUserCredentials } from "../typings/UserCredentials";

export interface ManageFriendRequestEventDto {
  action_type: "request" | "add" | "decline";
  // friend: { username: string };
  friend: MinUserCredentials | FriendCredentials;
}
