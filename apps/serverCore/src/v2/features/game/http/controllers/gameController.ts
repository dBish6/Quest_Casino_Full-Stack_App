/**
 * Game Controller
 *
 * Description:
 * Handles game related HTTP requests and responses; quests, bonuses, leaderboard and game lists.
 */

import type { Request, Response, NextFunction } from "express";
import type { AddGameRequestDto } from "@gameFeatHttp/dtos/AddGameDto"

import { type GameStatus, GAME_STATUSES } from "@qc/constants";

import { logger } from "@qc/utils";
import { handleHttpError } from "@utils/handleError";

import * as httpGameService from "@gameFeatHttp/services/httpGameService";

/**
 * Sends all games, client formatted.
 * @controller
 * @response `success` with client formatted games, or `HttpError`.
 */
export async function getGames(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const gameStatus = req.query.status as GameStatus;

  try {
    if (gameStatus && !GAME_STATUSES.includes(gameStatus))
      return res.status(400).json({ ERROR: "Game status is invalid." });

    const games = await httpGameService.getGames(true, gameStatus);

    return res.status(200).json({
      message: "Successfully retrieved all games.",
      games
    });
  } catch (error: any) {
    next(handleHttpError(error, "getGames controller error."));
  }
}

/**
 * Initiates adding of a game.
 * @controller
 * @response `success`, or `HttpError`.
 */
export async function addGame(
  req: AddGameRequestDto,
  res: Response,
  next: NextFunction
) {
  console.log("req body", req.body)

  try {
    await httpGameService.addGame(req.body);

    return res.status(200).json({ message: "Game added to the database successfully." });
  } catch (error: any) {
    next(handleHttpError(error, "getGames controller error."));
  }
}

/**
 * Sends all quests, client formatted.
 * @controller
 * @response `success` with client formatted quests, or `HttpError`.
 */
export async function getQuests(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quests = await httpGameService.getQuests();

    return res.status(200).json({
      message: "Successfully retrieved all quests.",
      quests
    });
  } catch (error: any) {
    next(handleHttpError(error, "getQuests controller error."));
  }
}

/**
 * Sends all bonuses, client formatted.
 * @controller
 * @response `success` with client formatted bonuses, or `HttpError`.
 */
export async function getBonuses(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bonuses = await httpGameService.getBonuses();

    return res.status(200).json({
      message: "Successfully retrieved all bonuses.",
      bonuses
    });
  } catch (error: any) {
    next(handleHttpError(error, "getBonuses controller error."));
  }
}

// TODO: Leaderboard
