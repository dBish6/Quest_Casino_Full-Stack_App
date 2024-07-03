import type { Request, Response, NextFunction } from "express";
import type { Rooms } from "@chatFeat/typings/Rooms";

import { handleApiError } from "@utils/handleError";

import * as httpChatService from "../services/httpChatService";

export const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatMessages = httpChatService.getMessages(req.query.roomId as Rooms);
    if (!chatMessages)
      return res.status(404).json({
        ERROR: "No chat messages found or room id doesn't exist.",
      });

    return res.status(200).json({
      message: `Messages for room ${req.query.roomId} successfully deleted retrieved.`,
      chat: chatMessages,
    });
  } catch (error: any) {
    next(handleApiError(error, "getChat controller error.", 500));
  }
};
