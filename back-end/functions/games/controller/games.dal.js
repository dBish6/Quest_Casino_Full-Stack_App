const { db, dbUtils } = require("../../model/firebaseConfig");
const { logger } = require("firebase-functions");
const moment = require("moment");

const getGameSessionData = async (uid, game) => {
  try {
    const userGameDocument = db
      .collection("games_sessions")
      .where(dbUtils.FieldPath.documentId(), "==", uid);

    let sessionData;
    if (game === "blackjack") {
      sessionData = await userGameDocument.select("game.blackjack").get();
    }

    if (!sessionData.empty) return sessionData.docs[0].data();
  } catch (error) {
    logger.error("games.dal error: getGameSessionData");
    throw error;
  }
};

const setGameSessionData = async (uid, game) => {
  try {
    const userGameDocument = db.collection("games_sessions").doc(uid);

    let newSessionData;
    if (game === "blackjack") {
      newSessionData = await userGameDocument.set({
        timestamp: moment().format(),
        game: {
          blackjack: {},
        },
      });
    }

    return newSessionData;
  } catch (error) {
    logger.error("games.dal error: setGameSessionData");
    throw error;
  }
};

const updateGameSessionData = async (uid, game, gameData) => {
  try {
    const userGameDocument = db.collection("games_sessions").doc(uid);

    let newSessionData;
    if (game === "blackjack") {
      newSessionData = await userGameDocument.set(
        {
          timestamp: moment().format(),
          game: {
            blackjack: {
              deck: gameData.deck,
              game_type: gameData.gameType,
              dealer: {
                cards: gameData.dealer.cards,
                face_down_score: gameData.dealer.faceDownScore,
                score: gameData.dealer.score,
                has_natural: gameData.dealer.hasNatural,
              },
              player: {
                cards: gameData.player.cards,
                score: gameData.player.score,
                bet: gameData.player.bet,
                has_natural: gameData.player.hasNatural,
                win_streak: gameData.player.winStreak,
              },
              winner: gameData.winner,
            },
          },
        },
        { merge: true }
      );
    }

    return newSessionData;
  } catch (error) {
    logger.error("games.dal error: setGameSessionData");
    throw error;
  }
};

module.exports = {
  getGameSessionData,
  setGameSessionData,
  updateGameSessionData,
};
