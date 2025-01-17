/**
 * HTTP Game Service
 *
 * Description:
 * Handles HTTP-related functionalities related to games; quests, bonuses, leaderboard and game lists.
 */

import type { ObjectId } from "mongoose";
import type { GameStatus, GameQuestStatus } from "@qc/constants";
import type { AddGameBodyDto, AddQuestBodyDto, AddBonusBodyDto } from "@gameFeatHttp/dtos/AddGameDto";

import { Types } from "mongoose";

import CLIENT_COMMON_EXCLUDE from "@constants/CLIENT_COMMON_EXCLUDE";

import { handleHttpError, HttpError } from "@utils/handleError";

import { getUser } from "@authFeat/services/authService";
import { Game, GameQuest, GameBonus } from "@gameFeat/models";

export type AddGameType = "Game" | "Quest" | "Bonus";

const MODALS = Object.freeze({
  Game,
  GameQuest,
  GameBonus
});

/**
 * Adds a new game related document to the database.
 * @param type The type of entity to add (`Game`, `Quest`, or `Bonus`).
 */
export async function addGame(type: AddGameType, body: AddGameBodyDto | AddQuestBodyDto | AddBonusBodyDto) {
  try {
    await new MODALS[(type === "Game" ? type : `Game${type}`) as keyof typeof MODALS](
      { _id: new Types.ObjectId(), ...body }
    ).save();
  } catch (error: any) {
    throw handleHttpError(error, "addGame service error.");
  }
}

/**
 * Gets all games from the database optionally for the client or internal use.
 */
export async function getGames(status?: GameStatus, forClient?: boolean) {
  try {
    return await Game.find({
      ...(forClient ? { status: { $ne: "inactive" } } : status && { status }),
    }).select(
      forClient
        ? `${CLIENT_COMMON_EXCLUDE} ${status !== undefined ? `-status ${status !== "active" ? " -odds" : ""}` : ""}`
        : ""
    );
  } catch (error: any) {
    throw handleHttpError(error, "getGames service error.");
  }
}
/**
 * Gets a specific game from the database.
 * @throws `HttpError 404` if the document is not found.
 */
export async function getGame(by: "_id" | "title", value: ObjectId | string) {
  try {
    const game = await Game.findOne({ [by]: value });
    if (!game) throw new HttpError("Game doesn't exist.", 404);
    
    return game;
  } catch (error: any) {
    throw handleHttpError(error, "getGame service error.");
  }
}

/**
 * Gets all quests from the database optionally for the client or internal use.
 * @throws `HttpError 404` user not found if a username is passed.
 */
export async function getQuests(username?: string, status?: GameQuestStatus, forClient?: boolean) {
  try {
    if (username) {
      const user = await getUser("username", username, {
        projection: "-_id statistics",
        populate: {
          path: "statistics",
          select: "-_id progress.quest",
          populate: [
            {
              path: "progress.quest.$*.quest",
              select: CLIENT_COMMON_EXCLUDE
            }
          ]
        }
      });
      if (!user) throw new HttpError(`Unable to find profile with the username ${username}.`, 404);

      return user;
    } else {
      return await GameQuest.find({
        ...(forClient ? { status: { $ne: "inactive" } } : status && { status })
      }).select(forClient ? `${CLIENT_COMMON_EXCLUDE} -status` : "");
    }
  } catch (error: any) {
    throw handleHttpError(error, "getQuests service error.");
  }
}
/**
 * Gets a specific quest from the database.
 * @throws `HttpError 404` if the document is not found.
 */
export async function getQuest(by: "_id" | "title", value: ObjectId | string) {
  try {
    const quest = await GameQuest.findOne({ [by]: value });
    if (!quest) throw new HttpError("Quest doesn't exist.", 404);

    return quest;
  } catch (error: any) {
    throw handleHttpError(error, "getQuest service error.");
  }
}

/**
 * Gets all bonuses from the database optionally for the client or internal use.
 */
export async function getBonuses(forClient?: boolean) {
  try {
    return await GameBonus.find().select(forClient ? CLIENT_COMMON_EXCLUDE : "");
  } catch (error: any) {
    throw handleHttpError(error, "getBonuses service error.");
  }
}
/**
 * Gets a specific bonus from the database.
 * @throws `HttpError 404` if the document is not found.
 */
export async function getBonus(by: "_id" | "title", value: ObjectId | string) {
  try {
    const bonus = await GameBonus.findOne({ [by]: value });
    if (!bonus) throw new HttpError("Bonus doesn't exist.", 404);

    return bonus;
  } catch (error: any) {
    throw handleHttpError(error, "getBonus service error.");
  }
}
