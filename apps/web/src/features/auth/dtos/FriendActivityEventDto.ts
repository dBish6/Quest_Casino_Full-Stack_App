import { ActivityStatuses } from "@qc/typescript/typings/UserCredentials";

export default interface FriendActivityEventDto {
  member_id: string;
  status: ActivityStatuses;
}
