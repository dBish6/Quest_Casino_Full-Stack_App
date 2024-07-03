import type { PublicRooms } from "@chatFeat/typings/Rooms";

import { model } from "mongoose";
import { messageGlobalSchema, messagePrivateSchema } from "./schemas/messageSchema";
import "./middleware";

export const MessageGlobal = (continent: PublicRooms) => model(`message_global`, messageGlobalSchema, `message_${continent}`),
    MessagePrivate = model(`message_private`, messagePrivateSchema)
