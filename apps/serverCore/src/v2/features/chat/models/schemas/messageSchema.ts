import type { Model } from "mongoose";
import type { MessageGlobalDoc, MessagePrivateDoc } from "@chatFeat/typings/Message";

import { Schema } from "mongoose";
import defaults from "@utils/schemaDefaults";

export const messageGlobalSchema = new Schema<MessageGlobalDoc, Model<MessageGlobalDoc>>(
  {
    _id: { type: Schema.ObjectId, immutable: true },
    username: { type: String, required: true },
    room_id: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    // collection: "message_global",
    capped: { size: 102400, max: 40 },
    ...defaults.options,
  }
);

export const messagePrivateSchema = new Schema<MessagePrivateDoc, Model<MessagePrivateDoc>>(
  {
    _id: { type: Schema.ObjectId, immutable: true },
    username: { type: String, required: true },
    room_id: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    collection: "message_private",
    // capped: { size: 102400, max: 40 },
    ...defaults.options,
  }
);
