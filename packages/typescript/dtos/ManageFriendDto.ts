import { FriendCredentials } from "../typings/UserCredentials"

export default interface ManageFriendDto {
  username: string;
  friend?: FriendCredentials;
}
