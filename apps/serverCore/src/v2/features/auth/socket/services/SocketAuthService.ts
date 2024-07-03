/**
 * Socket Chat Service
 *
 * Description:
 * Manages real-time user authentication and management.
 */

import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
import type ManageFriendDto from "@qc/typescript/dtos/ManageFriendDto";

import { handleSocketError } from "@utils/handleError";

import { getUser } from "@authFeatHttp/services/httpAuthService";

export default class SocketAuthService {
  private socket: Socket;
  private io: Namespace;

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
  }

  /**
   * Adds a new friend to a user's friend list if necessary and emits the current or changed user's friend list.
   */
  async manageFriends(data: ManageFriendDto, callback: SocketCallback) {
    try {
      let user = await getUser("username", data.username);
      if (!user)
        return callback({
          status: "not found",
          ERROR: "User doesn't exist.",
        });

      if (data.friend)
        user = user!.updateOne(
          { $push: { friends: data.friend } },
          { runValidators: true, new: true }
        ) as any;

      return callback({
        status: "ok",
        message: `Successfully ${data.friend ? "added and" : ""} retrieved friends.`,
        friends: user!.friends,
      });
    } catch (error: any) {
      throw handleSocketError(this.socket, error, {
        from: "manageFriends service error.",
      });
    }
  }
}
