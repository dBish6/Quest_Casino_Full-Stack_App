export enum AuthEvent {
  INITIALIZE_FRIENDS = "initialize_friends",
  MANAGE_FRIEND_REQUEST = "manage_friend_request",
  FRIENDS_UPDATE = "friends_update",
  FRIEND_ACTIVITY = "friend_activity",

  USER_ACTIVITY = "user_activity",

  NEW_NOTIFICATION = "new_notification",
}

export enum ChatEvent {
  MANAGE_CHAT_ROOM = "manage_chat_room",

  TYPING = "typing",
  FRIEND_TYPING_ACTIVITY = "friend_typing_activity",

  CHAT_MESSAGE = "chat_message",
  CHAT_MESSAGE_SENT = "chat_message_sent",
}