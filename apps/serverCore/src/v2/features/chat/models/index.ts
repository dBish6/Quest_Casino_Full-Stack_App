import { model } from "mongoose";
import { privateChatMessageSchema } from "./schemas/chatMessageSchema";
import "./middleware";

export { GlobalChatMessage } from "./schemas/chatMessageSchema";
export const PrivateChatMessage = model("chat_message_private", privateChatMessageSchema);
