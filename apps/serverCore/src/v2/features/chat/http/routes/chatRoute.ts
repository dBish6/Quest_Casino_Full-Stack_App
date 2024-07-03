import { Router } from "express";
import { verifyUserToken, verifyCsrfToken } from "@authFeatHttp/middleware/tokens";
import * as chatController from "@chatFeatHttp/controllers/chatController";

const router = Router();

router.get("/", verifyUserToken, chatController.getChat);

export default router;
