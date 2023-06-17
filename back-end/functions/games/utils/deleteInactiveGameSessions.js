const { logger } = require("firebase-functions");
const getInactiveDocuments = require("../../utils/getInactiveDocuments");
const {
  getAllGameSessions,
  deleteGameSession,
} = require("../controller/games.dal");

const deleteInactiveGameSessions = async () => {
  const inactiveGameSessions = await getInactiveDocuments(getAllGameSessions);
  if (inactiveGameSessions) {
    for (const docId of inactiveGameSessions) {
      deleteGameSession(docId);
    }
  }

  logger.info("Inactive game sessions check completed successfully.");
};

module.exports = deleteInactiveGameSessions;
