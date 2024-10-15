import { ActivityStatuses } from "@qc/typescript/typings/UserCredentials";

export default interface FriendActivityEventDto {
  verification_token: string;
  status: ActivityStatuses;
}
