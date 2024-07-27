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

export declare enum AuthEvent {
    INITIALIZE_FRIENDS = "initialize_friends",
    MANAGE_FRIEND_ROOM = "manage_friend_room",
    MANAGE_FRIEND_REQUEST = "manage_friend_request",
    NEW_NOTIFICATION = "new_notification",
    FRIENDS_UPDATE = "friends_update",
    FRIEND_ACTIVITY = "friend_activity"
}

