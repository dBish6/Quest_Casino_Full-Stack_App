export type PublicRooms = "North America" | "Europe" | "Asia";
/**
 * Username of the user's friend.
 */
export type PrivateRooms = string;

/**
 * Either a public room or a private room.
 */
export type Rooms = PublicRooms | PrivateRooms;
