const { Router } = require("express");
const { logger } = require("firebase-functions");

const gameDal = require("../controller/games.dal");
const verifyCsrfToken = require("../../middleware/verifyCsrfToken");

const router = Router();

router.get("/api/firebase/session", async (req, res) => {
  if (DEBUG) logger.debug("/games/api/firebase/session queries:", req.query);

  let fsRes;
  try {
    fsRes = await gameDal.getGameSessionData(req.query.uid, req.query.game);

    if (!fsRes) {
      fsRes = await gameDal.setGameSessionData(req.query.uid, req.query.game);

      if (DEBUG)
        logger.debug("DEBUGGER: Game session document was set initially.");
      return res.status(201).json({
        fsRes: fsRes,
        message:
          "/games/api/firebase/session successfully set the session document initially due to the current user having their first game or the document was removed.",
      });
    }

    if (DEBUG) logger.debug("DEBUGGER: Game session data was sent client.");
    return res.status(200).json(fsRes);
  } catch (error) {
    logger.error(error);
    if (error.code === "auth/too-many-requests") {
      return res.status(429).json(error);
    } else {
      return res.status(500).json({
        fsRes: false,
        ERROR:
          "/games/api/firebase/session failed to send the game session data.",
      });
    }
  }
});

router.patch("/api/firebase/session", verifyCsrfToken, async (req, res) => {
  if (DEBUG) logger.debug("/games/api/firebase/session body:", req.body);

  try {
    const gameData = ({ deck, dealer, player } = req.body);
    const fsRes = await gameDal.updateGameSessionData(
      req.query.uid,
      req.query.game,
      gameData
    );

    return res.status(200).json(fsRes);
  } catch (error) {
    logger.error(error);
    if (error.code === "auth/too-many-requests") {
      return res.status(429).json(error);
    } else {
      return res.status(500).json({
        fsRes: false,
        ERROR: "/games/api/firebase/session failed to set the game session.",
      });
    }
  }
});

module.exports = router;
