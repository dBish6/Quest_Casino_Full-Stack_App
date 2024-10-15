import { Router } from "express";
import { verifyUserToken, verifyCsrfToken } from "@authFeatHttp/middleware/tokens";
import * as gameController from "@gameFeatHttp/controllers/gameController";

const router = Router();

router.get("/games", gameController.getGames);
// router.get("/game/:id", gameController.getGame);
router.post("/add", verifyCsrfToken, gameController.addGame);

// TODO: If you only show quests and bonuses when logged in use verifyUserToken middleware here.
router.get("/quests", gameController.getQuests);

router.get("/bonuses", gameController.getBonuses);

export default router;
