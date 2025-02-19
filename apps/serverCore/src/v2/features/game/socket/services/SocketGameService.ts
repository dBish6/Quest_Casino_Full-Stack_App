/**
 * Socket Game Service
 *
 * Description:
 * Manages game related logic in real-time; wins, losses, progress for quests and bonuses.
 */

import type { Socket, Namespace } from "socket.io";
import type SocketCallback from "@typings/SocketCallback";
import type { UserBonus, UserQuest } from "@authFeat/typings/User";

import type { ManageProgressEventDto } from "@qc/typescript/dtos/ManageProgressEventDto";

import { Types } from "mongoose"

import GENERAL_BAD_REQUEST_MESSAGE from "@constants/GENERAL_BAD_REQUEST_MESSAGE";
import USER_NOT_FOUND_MESSAGE from "@authFeat/constants/USER_NOT_FOUND_MESSAGE";

import { logger } from "@qc/utils";
import { handleSocketError, SocketError } from "@utils/handleError";

import { GameQuest, GameBonus } from "@gameFeat/models";
import { User } from "@authFeat/models";
import { updateUserStatistics } from "@authFeat/services/authService";

export default class SocketAuthService {
  private socket: Socket;
  private io: Namespace;

  constructor(socket: Socket, io: Namespace) {
    this.socket = socket;
    this.io = io;
  }

  /**
   * Adds a win, draw or loss to the user.
   */
  public async manageRecord({}, callback: SocketCallback) {
    logger.debug("socket manageRecord:", {});
  
    try {
      // const user = this.socket.userDecodedClaims!;

      return callback({
        status: "accepted",
        message: "Under construction."
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "manageRecord service error.");
    }
  }

  /**
   * Increases the current progress of a quest or bonus and can also activate a bonus.
   * @payload `ok` with quest or bonus progress, `bad request`, `forbidden`, `conflict` or `SocketError`.
   */
  public async manageProgress({ type, action, title }: ManageProgressEventDto, callback: SocketCallback) {
    logger.debug("socket manageProgress:", { type, action, title });
  
    try {
      const userClaims = this.socket.userDecodedClaims!;

      if (type !== "bonus" && action === "activate") throw new SocketError(GENERAL_BAD_REQUEST_MESSAGE, "bad request");

      const exists = await (type === "quest" ? GameQuest : GameBonus).exists({ title: title });
      if (!exists) throw new SocketError("Access Denied", "forbidden");

      const isActivate = type === "bonus" && action === "activate",
        now = Date.now();

      const user = await User.aggregate([
        { $match: { _id: new Types.ObjectId(userClaims.sub) } },
        {
          $lookup: {
            from: "user_statistics",
            localField: "statistics",
            foreignField: "_id",
            as: "statistics"
          }
        },
        { $unwind: "$statistics" },
        // Checks if there is no active bonus already for the user.
        ...(isActivate
          ? [
              {
                $set: {
                  activeBonus: {
                    $map: {
                      input: { $objectToArray: "$statistics.progress.bonus" },
                      as: "bonus",
                      in: {
                        k: "$$bonus.k",
                        v: "$$bonus.v"
                      }
                    }
                  }
                }
              },
              {
                $set: {
                  activeBonus: {
                    $filter: {
                      input: "$activeBonus",
                      as: "bonus",
                      cond: { $gt: ["$$bonus.v.activated", now] }
                    }
                  }
                }
              },
              {
                $match: { activeBonus: { $size: 0 } }
              }
            ]
          : []),
        {
          $project: {
            "_id": 0,
            "statistics.progress": 1
          }
        }
      ]);
      if (!user[0]) {
        if (isActivate) {
          // Checks if the reason wasn't because of the id.
          const exists = await User.exists({ _id: userClaims.sub });
          if (!exists) throw new SocketError(USER_NOT_FOUND_MESSAGE, "not found");
          
          throw new SocketError(
            "You can only have one bonus active at a time. Please wait 24 hours before activating a new one.",
            "conflict"
          );
        } else {
          throw new SocketError(USER_NOT_FOUND_MESSAGE, "not found");
        }
      }
      const target = user[0].statistics.progress[type][title];

      if (isActivate) this.isBonusActivatable(target as UserBonus);

      if (!this.isQuestOrBonusCompleted(type, target))
        throw new SocketError(
          `You cannot ${isActivate ? "activate" : "be reward for"} this ${type} yet because your current progress has not yet completed.`,
          "bad request"
        );

      const path = `progress.${type}.${title}`,
        updatedUser = await updateUserStatistics(
          {
            by: "_id",
            value: userClaims.sub
          },
          {
            $set: {
              [`${path}.${type}`]: exists._id,
              ...(isActivate && {
                [`${path}.activated`]: Date.now() + 60 * 60 * 24 * 1000
              })
            },
            ...(action === "progress" && {
              $inc: { [`${path}.current`]: 1 }
            })
          },
          { new: true, projection: "-_id progress", forClient: true }
        );

      return callback({
        status: "ok",
        message: `Successfully ${action === "activate" ? action + "d" : "gained progress for"} ${type} "${title}".`,
        progress: { [type]: updatedUser.progress[type as keyof typeof updatedUser.progress] }
      });
    } catch (error: any) {
      return handleSocketError(callback, error, "manageProgress service error.");
    }
  }

  /**
   * Validates if the given bonus can be activated.
   */
  private isBonusActivatable(userBonus: UserBonus | undefined) {
    if (userBonus?.activated) {
      // Checks if the bonus is currently active.
      if (userBonus.activated > Date.now())
        throw new SocketError(
          "This bonus is already activated, you must wait till that bonus expires. All bonuses last 24 hours.",
          "conflict"
        );

      // Checks if the bonus was already activated before and expired.
      if (userBonus.activated <= Date.now())
        throw new SocketError(
          "The bonus was already activated before and has now expired. You cannot reactivate it.",
          "conflict"
      );
    }

    return true;
  };

  /**
   * Checks if the current progress reached the quest or bonus progress cap.
   */
  private isQuestOrBonusCompleted(
    type: "quest" | "bonus",
    // @ts-ignore
    { current, [type]: questOrBonus }: UserBonus | UserQuest = {}
  ) {
    // There is only 'one-time' (0/0) bonuses, not quests.
    if (type === "bonus" && !current && !questOrBonus?.cap) {
      return true;
    }

    return current >= (questOrBonus?.cap || 0);
  };
}
