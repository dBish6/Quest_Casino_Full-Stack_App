import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

type FriendsUpdateEventDto =
  | { update: UserCredentials["friends"] }
  | { remove: { pending?: string; list?: string } };
export default FriendsUpdateEventDto
