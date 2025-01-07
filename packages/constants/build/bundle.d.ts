export declare const AVATAR_FILE_EXTENSIONS: ReadonlySet<string>;
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
    FRIEND_TYPING_ACTIVITY = "friend_typing_activity",
    CHAT_MESSAGE = "chat_message",
    CHAT_MESSAGE_SENT = "chat_message_sent"
}
export declare enum GameEvent {
    MANAGE_RECORD = "manage_record",
    MANAGE_PROGRESS = "manage_progress"
}
export declare const GAME_STATUSES: readonly ["active", "development", "inactive"], GAME_CATEGORIES: readonly ["table", "slots", "dice"];
export type GameStatus = (typeof GAME_STATUSES)[number];
export type GameCategory = (typeof GAME_CATEGORIES)[number];
export declare const GAME_QUEST_REWARD_TYPES: readonly ["money", "spins"], GAME_QUEST_FOR: readonly ["all", "blackjack", "slots", "dice"], GAME_QUEST_STATUSES: readonly ["active", "inactive"];
export type GameQuestRewardType = (typeof GAME_QUEST_REWARD_TYPES)[number];
export type GameQuestFor = (typeof GAME_QUEST_FOR)[number];
export type GameQuestStatus = (typeof GAME_QUEST_STATUSES)[number];
export declare const TRANSACTION_TYPES: readonly ["deposit", "withdraw"];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
