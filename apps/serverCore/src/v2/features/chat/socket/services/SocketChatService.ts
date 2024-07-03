/**
 * Socket Chat Service
 *
 * Description:
 * Handles real-time chat functionalities including managing rooms, user typing status, and global and private messaging.
 */

import type { Socket, Namespace } from "socket.io";
import type { Rooms, PublicRooms, PrivateRooms } from "@chatFeat/typings/Rooms";
import type SocketCallback from "@typings/SocketCallback";
import type MessageDto from "@chatFeat/dtos/MessageDto";

import { logger } from "@qc/utils";
import { handleSocketError } from "@utils/handleError";
import continentUtils from "@chatFeat/utils/ContinentUtils";

import { redisClient } from "@cache";
import { addMessage } from "@chatFeatHttp/services/httpChatService";

interface CommonDto {
  username: string;
  room_id: Rooms;
}

export interface ManageRoomDto extends CommonDto {
  action_type: "join" | "leave";
}

export interface TypingDto extends CommonDto {
  is_typing: boolean;
}

type GlobalChatRooms = "North America" | "Europe" | "Asia";

const GLOBAL_ROOM_MAPPING = {
  "North America": "North America",
  "South America": "North America",
  Europe: "Europe",
  Asia: "Asia",
  Africa: "Europe",
  Oceania: "Asia",
  Antarctica: "North America",
} as const;

export default class SocketChatService {
  private socket: Socket;
  private io: Namespace;
  private globalRoom: GlobalChatRooms | null;

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
    this.globalRoom = null;
  }

  /**
   * Handles joins and leaves of chat rooms.
   */
  async manageRoom(data: ManageRoomDto, callback: SocketCallback) {
    const { username, room_id, action_type } = data;

    if (!["join", "leave"].includes(action_type)) {
      throw handleSocketError(
        this.socket,
        Error(
          `There was no data provide for a join or the type isn't valid; "leave" or "join".`
        ),
        { status: "bad request", from: "manageRoom service error." }
      );
    }

    try {
      this.globalRoom = await this.#cacheGlobalRegion()

      const room = room_id as string,
        type = action_type === "join" ? "joined" : "left"

      this.socket[action_type](room);

      this.socket.in(room).emit("get_chat_message", { message: `${username} has ${type} the chat.` });

      callback({ status: "ok", message: `User successfully ${type} ${room}.` });
    } catch (error: any) {
      throw handleSocketError(this.socket, error, { from: "manageRoom service error." });
    }
  }

  /**
   * Notifies when a user starts or stops typing in a chat room.
   */
  typing(data: TypingDto, resCallback: SocketCallback) {
    const { username, room_id, is_typing } = data;
    console.log("User typing", data);

    try {
      this.socket.in(room_id).emit("user_typing", { username, is_typing });

      resCallback({
        status: "ok",
        message: is_typing ? "User is typing." : "User stopped typing.",
      });
    } catch (error: any) {
      console.error("typing service error:\n", error.message);
      resCallback(error.message);
    }
  }

  /**
   * Handles the messages of a chat room; stores the message and sends it back.
   */
  async chatMessage(data: MessageDto, resCallback: SocketCallback) {
    console.log("Received message: ", data);

    try {
      const message = await addMessage(data);
      this.io.in(data.room_id).emit("get_chat_message", message);

      resCallback({ status: "ok", message: "Message emitted." });
    } catch (error: any) {
      console.error("chatMessage service error:\n", error.message);
      resCallback(error.message);
    }
  }

  async #cacheGlobalRegion(): Promise<GlobalChatRooms> {
    const user = this.socket.request.decodedClaims!,
      [country, globalRoom] = await Promise.all([
        redisClient.get(`user:${user.sub}:country`),
        redisClient.get(`user:${user.sub}:global_chat`),
      ]);

    if (globalRoom && country === user.country)
      return globalRoom as GlobalChatRooms;

    let continent = continentUtils.getContinentByCountry(user.country);
    if (!continent) {
      logger.warn(
        "cacheGlobalRegion warning:\nCouldn't find the user's continent by country, defaulting to Asia."
      );
      continent = "Asia";
    } else {
      continent =
        GLOBAL_ROOM_MAPPING[continent as keyof typeof GLOBAL_ROOM_MAPPING];
    }

    await Promise.all([
      redisClient.set(`user:${user.sub}:country`, user.country),
      redisClient.set(`user:${user.sub}:global_chat`, continent),
    ]);

    return continent as GlobalChatRooms;
  }
}
