export interface Country {
    name: string;
    abbr: string;
    callingCode: string;
    continent: string;
}
export declare const COUNTRIES: {
    name: string;
    abbr: string;
    callingCode: string;
    continent: string;
}[];
export declare const COUNTRIES_MAP: Map<string, {
    name: string;
    abbr: string;
    callingCode: string;
    continent: string;
}>;
export declare enum AuthEvent {
    INITIALIZE_FRIENDS = "initialize_friends",
    MANAGE_FRIEND_REQUEST = "manage_friend_request",
    FRIENDS_UPDATE = "friends_update",
    FRIEND_ACTIVITY = "friend_activity",
    USER_ACTIVITY = "user_activity",
    NEW_NOTIFICATION = "new_notification"
}
export declare enum ChatEvent {
    MANAGE_CHAT_ROOM = "manage_chat_room",
    TYPING = "typing",
    TYPING_ACTIVITY = "typing_activity",
    CHAT_MESSAGE = "chat_message",
    CHAT_MESSAGE_SENT = "chat_message_sent"
}
export declare const GAME_STATUSES: readonly ["active", "development", "inactive"], GAME_CATEGORIES: readonly ["table", "slots", "dice"];
export type GameStatus = (typeof GAME_STATUSES)[number];
export type GameCategory = (typeof GAME_CATEGORIES)[number];
