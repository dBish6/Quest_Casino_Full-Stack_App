const express = require("express");
const router = express.Router();

const questDal = require("../controllers/quest.dal");

// Get All Quests
router.get("/api/firebase", async (req, res) => {
  if (DEBUG) console.log("/quest/api/firebase");
  try {
    const fsRes = await questDal.getAllQuestsFromDb();
    if (!fsRes.length) {
      res.status(404).json({
        firestoreRes: fsRes,
        ERROR: "/quest/api/firebase found no data.",
      });
    } else if (fsRes) {
      res.json(fsRes);
      if (DEBUG) console.log("DEBUGGER: Quests was sent to client.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      fsRes: false,
      ERROR: "/quest/api/firebase failed to send data.",
    });
  }
});

// Get Certain Quest
router.get("/api/firebase/:title", async (req, res) => {
  if (DEBUG) console.log("/quest/api/firebase/:title req:", req.params);

  try {
    const fsRes = await questDal.getQuestFromDb(req.params.title);

    if (fsRes === "Quest doesn't exist.") {
      res.status(404).json({
        user: fsRes,
        ERROR: "/quest/api/firebase/:id failed to find the document.",
      });
    } else if (fsRes) {
      res.json(fsRes);
      if (DEBUG) console.log("DEBUGGER: Quest was sent to client.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      user: false,
      ERROR: "/quest/api/firebase/:id failed to send data.",
    });
  }
});

module.exports = router;
