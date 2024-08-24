import type { Model } from "mongoose";
import type { GlobalChatMessageDoc, PrivateChatMessageDoc } from "@chatFeat/typings/ChatMessage";

import { Schema } from "mongoose";
import defaults from "@utils/schemaDefaults";

const { timestamps, ...options } = defaults.options;

export const globalChatMessageSchema = new Schema<GlobalChatMessageDoc, Model<GlobalChatMessageDoc>>(
  {
    _id: { type: Schema.ObjectId, immutable: true },
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
    // collection: "message_global",
    capped: { size: 102400, max: 40 },
    timestamps: { createdAt: "created_at" }, 
    ...options 
  }
).index({ created_at: -1 });

// For very active users, consider archiving old messages to maintain performance. - for private.
export const privateChatMessageSchema = new Schema<PrivateChatMessageDoc, Model<PrivateChatMessageDoc>>(
  {
    _id: { type: Schema.ObjectId, immutable: true }, // User Id
    chats: {
      type: [
        {
          // _id: { type: Schema.ObjectId, immutable: true }, // Friend Id
          // friend_id: { type: Schema.ObjectId, immutable: true },
          room_id: { type: String, unique: true, immutable: true, required: true },
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
          created_at: { type: Date, default: Date.now }
        }
      ]
    }
  },
  {
    collection: "chat_message_private",
    // capped: { size: 102400, max: 40 },
    ...defaults.options
  }
).index({ "messages.created_at": -1 });

// export const privateChatMessageSchema = new Schema<PrivateChatMessageDoc, Model<PrivateChatMessageDoc>>(
//   {
//     _id: { type: Schema.ObjectId, immutable: true },
//     room_id: { type: String, required: true },
//     username: { type: String, required: true },
//     message: { type: String, required: true }
//   },
//   {
//     collection: "message_private",
//     // capped: { size: 102400, max: 40 },
//     ...defaults.options
//   }
// );
