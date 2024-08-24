export type GlobalChatRoomId = "North America" | "Europe" | "Asia";
/**
 * `verification_token` of the user's friend.
 */
export type PrivateChatRoomId = string;

/**
 * Either a global or a private room ID.
 */
export type ChatRoomId = GlobalChatRoomId | PrivateChatRoomId;
