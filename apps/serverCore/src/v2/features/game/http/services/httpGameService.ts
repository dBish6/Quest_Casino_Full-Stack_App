/**
 * HTTP Auth Service
 *
 * Description:
 * Handles HTTP-related functionalities related to games; quests, bonuses, leaderboard and game lists.
 */

// import type { ObjectId, PopulateOptions, Query, UpdateQuery, QueryOptions } from "mongoose";
import type { GameStatus } from "@qc/constants";
import type { AddGameBodyDto } from "@gameFeatHttp/dtos/AddGameDto";

import { Types } from "mongoose";

import CLIENT_COMMON_EXCLUDE from "@constants/CLIENT_COMMON_EXCLUDE";

import { handleHttpError, HttpError } from "@utils/handleError";

import { Game, GameQuest, GameBonus } from "@gameFeat/models";

/**
 * Gets all games from the database optionally for the client or internal use.
 */
export async function getGames(forClient?: boolean, status?: GameStatus) {
  try {
    return await Game.find({ ...(status && { status }) }).select(
      forClient
        ? `${CLIENT_COMMON_EXCLUDE} ${status !== undefined ? `-status ${status !== "active" ? " -odds" : ""}` : ""}`
        : ""
    );
  } catch (error: any) {
    throw handleHttpError(error, "getGames service error.");
  }
}

/**
 * Adds a new game to the database.
 */
export async function addGame(game: AddGameBodyDto) {
  try {
    await new Game({ _id: new Types.ObjectId(), ...game }).save();
  } catch (error: any) {
    throw handleHttpError(error, "addGame service error.");
  }
}

/**
 * Gets all quests from the database optionally for the client or internal use.
 */
export async function getQuests(forClient?: boolean) {
  try {
    return await GameQuest.find().select(forClient ? CLIENT_COMMON_EXCLUDE : "");
  } catch (error: any) {
    throw handleHttpError(error, "getQuests service error.");
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
