/**
 * Game Controller
 *
 * Description:
 * Handles game related HTTP requests and responses; quests, bonuses, leaderboard and game lists.
 */

import type { Request, Response, NextFunction } from "express";
import type { AddGameType } from "@gameFeatHttp/services/httpGameService";

import type { AddGameRequestDto } from "@gameFeatHttp/dtos/AddGameDto"

import { isValidObjectId } from "mongoose";

import { type GameStatus, type LeaderboardType, GAME_STATUSES, LEADERBOARD_TYPES, GAME_QUEST_STATUSES, GAME_BONUS_STATUSES } from "@qc/constants";
import GENERAL_BAD_REQUEST_MESSAGE from "@constants/GENERAL_BAD_REQUEST_MESSAGE";

import { capitalize } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";
import getRotateQuestsOrBonusesExpiry from "@gameFeat/utils/getRotateQuestsAndBonusesExpiry";

import * as generalGameService from "@gameFeat/services/gameService";
import * as httpGameService from "@gameFeatHttp/services/httpGameService";

const gameService = { ...generalGameService, ...httpGameService }

/**
 * Initiates adding of a game related document (not indented to be used for the main client).
 * @controller
 * @response `success`, or `HttpError`.
 */
export async function addGame(
  req: AddGameRequestDto,
  res: Response,
  next: NextFunction
) {
  const { type = "game" } = req.params;

  try {
    if (process.env.NODE_ENV !== "development") res.status(403).json({ ERROR: "Access Denied" });
    else if (!["game", "quest", "bonus"].includes(type))
      return res.status(400).json({ ERROR: `/${type} is an invalid type. Use "/quest", or "/bonus".` });

    await gameService.addGame(capitalize(type) as AddGameType, req.body);

    return res.status(200).json({ message: `Successfully added ${type} to the database successfully.` });
  } catch (error: any) {
    next(handleHttpError(error, "addGame controller error."));
  }
}

/**
 * Sends all games, client formatted.
 * @controller
 * @response `success` with client formatted games, or `HttpError`.
 */
export async function getGames(req: Request, res: Response, next: NextFunction) {
  const status = req.query.status as GameStatus;

  try {
    if (status && !GAME_STATUSES.includes(status))
      return res.status(400).json({ ERROR: "Game status is invalid." });

    const games = await gameService.getGames(status, true);

    return res.status(200).json({ message: "Successfully retrieved all games.", games });
  } catch (error: any) {
    next(handleHttpError(error, "getGames controller error."));
  }
}
/**
 * Sends back the specified game (not indented to be used for the main client).
 * @controller
 * @response `success` with specified game, `bad request`, `not found`, or `HttpError`.
 */
export async function getGame(req: Request, res: Response, next: NextFunction) {
  const identifier = req.query.id;

  try {
    if (typeof identifier !== "string") {
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });
    } else if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ ERROR: "Access Denied" });
    }
    
    const game = await gameService.getGame(
      isValidObjectId(identifier) ? "_id" : "title", identifier
    );

    return res.status(200).json({ message: "Game found successfully.", game });
  } catch (error: any) {
    next(handleHttpError(error, "getGame controller error."));
  }
}

/**
 * Sends the top 10 users of Quest Casino by win rate or win total.
 * @controller
 * @response `success` with the top users, or `HttpError`.
 */
export async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  const { type } = req.query as Record<string, LeaderboardType>;

  try {
    if (!LEADERBOARD_TYPES.includes(type))
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });

    const users = await gameService.getLeaderboard(type);

    return res.status(200).json({ message: `Successfully retrieved top users via win ${type}.`, users });
  } catch (error: any) {
    next(handleHttpError(error, "getLeaderboard controller error."));
  }
}

/**
 * Sends all quests, client formatted.
 * @controller
 * @response `success` with client formatted quests, or `HttpError`.
 */
export async function getQuests(req: Request, res: Response, next: NextFunction) {
  const { username, status } = req.query as Record<string, any>;

  try {
    if (status && process.env.NODE_ENV !== "development")
      return res.status(403).json({ ERROR: "Access Denied" });

    if (
      (username && typeof username !== "string") ||
      (status && !GAME_QUEST_STATUSES.includes(status))
    )
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });

    const quests = await gameService.getQuests({ username, status, forClient: true }),
      renew = await getRotateQuestsOrBonusesExpiry("quests");

    return res
      .status(200)
      .json({ message: "Successfully retrieved all quests.", quests, renew });
  } catch (error: any) {
    next(handleHttpError(error, "getQuests controller error."));
  }
}
/**
 * Sends back the specified quest (not indented to be used for the main client).
 * @controller
 * @response `success` with specified quest, `bad request`, `not found`, or `HttpError`.
 */
export async function getQuest(req: Request, res: Response, next: NextFunction) {
  const identifier = req.query.id;

  try {
    if (typeof identifier !== "string") {
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });
    } else if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ ERROR: "Access Denied" });
    }

    const quest = await gameService.getQuest(
      isValidObjectId(identifier) ? "_id" : "title", identifier
    );

    return res.status(200).json({ message: "Quest found Successfully.", quest });
  } catch (error: any) {
    next(handleHttpError(error, "getQuest controller error."));
  }
}

/**
 * Sends all bonuses, client formatted.
 * @controller
 * @response `success` with client formatted bonuses, or `HttpError`.
 */
export async function getBonuses(req: Request, res: Response, next: NextFunction) {
  const status = req.query.status as any;

  try {
    if (status && process.env.NODE_ENV !== "development")
      return res.status(403).json({ ERROR: "Access Denied" });

    if (status && !GAME_BONUS_STATUSES.includes(status))
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });

    const bonuses = await gameService.getBonuses({ status, forClient: true }),
      renew = await getRotateQuestsOrBonusesExpiry("bonuses");

    return res
      .status(200)
      .json({ message: "Successfully retrieved all bonuses.", bonuses, renew });
  } catch (error: any) {
    next(handleHttpError(error, "getBonuses controller error."));
  }
}
/**
 * Sends back the specified quest (not indented to be used for the main client).
 * @controller
 * @response `success` with specified bonus, `bad request`, `not found`, or `HttpError`.
 */
export async function getBonus(req: Request, res: Response, next: NextFunction) {
  const identifier = req.query.id;

  try {
    if (typeof identifier !== "string") {
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });
    } else if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ ERROR: "Access Denied" });
    }

    const bonus = await gameService.getBonus(
      isValidObjectId(identifier) ? "_id" : "title", identifier
    );

    return res.status(200).json({ message: "Bonus found Successfully.", bonus });
  } catch (error: any) {
    next(handleHttpError(error, "getBonus controller error."));
  }
}
