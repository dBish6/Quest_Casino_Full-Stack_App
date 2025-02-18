import type { Model } from "mongoose";
import type { GlobalChatMessageDoc, PrivateChatMessageDoc } from "@chatFeat/typings/ChatMessage";

import { Schema } from "mongoose";

import MAX_MESSAGES_COUNT from "@chatFeat/constants/MAX_MESSAGES_COUNT";

import defaults from "@utils/schemaDefaults";

export const globalChatMessageSchema = new Schema<GlobalChatMessageDoc, Model<GlobalChatMessageDoc>>(
  {
    avatar_url: {
      type: String,
      validate: {
        validator: (url: string) => {
          return /^https?:\/\//.test(url);
        },
        message: (props: any) => `${props.value} is not a valid URL.`
      }
    },
    room_id: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String, required: true }
  },
  {
    capped: { size: 102400, max: MAX_MESSAGES_COUNT.global.stored },
    ...defaults.options,
    timestamps: { createdAt: "created_at", updatedAt: false }
  }
).index({ created_at: 1 });

export const privateChatMessageSchema = new Schema<PrivateChatMessageDoc, Model<PrivateChatMessageDoc>>(
  {
    room_id: { type: String, unique: true, required: true },
    chats: {
      type: [
        {
          _id: false,
          room_id: { type: String, immutable: true, required: true },
          avatar_url: {
            type: String,
            validate: {
              validator: (url: string) => {
                return /^https?:\/\//.test(url);
              },
              message: (props: any) => `${props.value} is not a valid URL.`
            }
          },
          username: { type: String, required: true },
          message: { type: String, required: true },
          created_at: { type: Date, required: true }
        }
      ]
    }
  },
  {
    collection: "chat_message_private",
    ...defaults.options
  }
).index({ "chats.created_at": -1 });
