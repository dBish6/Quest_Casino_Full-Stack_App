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

import { type GameStatus, GAME_STATUSES } from "@qc/constants";
import GENERAL_BAD_REQUEST_MESSAGE from "@constants/GENERAL_BAD_REQUEST_MESSAGE";

import { capitalize } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";

import * as httpGameService from "@gameFeatHttp/services/httpGameService";

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

    await httpGameService.addGame(capitalize(type) as AddGameType, req.body);

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

    const games = await httpGameService.getGames(status, true);

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
    
    const game = await httpGameService.getGame(
      isValidObjectId(identifier) ? "_id" : "title", identifier
    );

    return res.status(200).json({ message: "Game found successfully.", game });
  } catch (error: any) {
    next(handleHttpError(error, "getGame controller error."));
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
    if (
      (username && typeof username !== "string") ||
      (status && !GAME_STATUSES.includes(status) && process.env.NODE_ENV === "development")
    )
      return res.status(400).json({ ERROR: GENERAL_BAD_REQUEST_MESSAGE });

    const quests = await httpGameService.getQuests(username, status, true);

    return res.status(200).json({ message: "Successfully retrieved all quests.", quests });
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

    const quest = await httpGameService.getQuest(
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
export async function getBonuses(_: Request, res: Response, next: NextFunction) {
  try {
    const bonuses = await httpGameService.getBonuses(true);

    return res.status(200).json({ message: "Successfully retrieved all bonuses.", bonuses });
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

    const bonus = await httpGameService.getQuest(
      isValidObjectId(identifier) ? "_id" : "title", identifier
    );

    return res.status(200).json({ message: "Bonus found Successfully.", bonus });
  } catch (error: any) {
    next(handleHttpError(error, "getBonus controller error."));
  }
}

// TODO: Leaderboard
