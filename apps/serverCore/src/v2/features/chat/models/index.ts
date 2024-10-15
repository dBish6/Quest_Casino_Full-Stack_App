import type { GlobalChatRoomId } from "@qc/typescript/typings/ChatRoomIds";

import { model } from "mongoose";
import { globalChatMessageSchema, privateChatMessageSchema } from "./schemas/chatMessageSchema";
import "./middleware";

export const GlobalChatMessage = (continent: GlobalChatRoomId) =>
  model(
    "chat_message_global",
    globalChatMessageSchema,
    `chat_message_global_${continent.replace(" ", "_").toLowerCase()}`
  ),
  PrivateChatMessage = model("chat_message_private", privateChatMessageSchema);
