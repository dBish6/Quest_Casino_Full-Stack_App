export type GlobalChatRoomId = "North America" | "Europe" | "Asia";
/**
 * Both the user's and the friend's `member_id`.
 */
export type PrivateChatRoomId = string;

/**
 * Either a global or a private room ID.
 */
export type ChatRoomId = GlobalChatRoomId | PrivateChatRoomId;
