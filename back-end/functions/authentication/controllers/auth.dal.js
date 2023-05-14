const { admin, db } = require("../../model/firebaseConfig");
const moment = require("moment");

// *Reads*
const getAllUsersFromDb = async () => {
  // FIXME: Could just send the felids we need.
  let documents = [];
  try {
    const collection = await db.collection("users").get();
    const response = collection.docs.map((doc) => documents.push(doc.data()));
    if (response) {
      documents.sort(() => Math.random() - 0.5);
      documents = documents.slice(0, 8);
      return documents;
    }
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: getAllUsersFromDb");
  }
};

const getUserFromDb = async (id) => {
  try {
    const document = await db.collection("users").doc(id).get();
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return document.data();
    }
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: getUserFromDb");
  }
};

const getUserBalanceCompletedQuestsFromDb = async (id) => {
  try {
    const document = await db
      .collection("users")
      .doc(id)
      .get({
        fields: ["balance", "completed_quests"],
      });
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return {
        balance: await document.get("balance"),
        completedQuests: await document.get("completed_quests"),
      };
    }
  } catch (error) {
    logger.error(error);
    if (DEBUG)
      logger.error("DEBUGGER: auth.dal error: getUserWinsBalanceFromDb");
  }
};

const getLeaderBoardFromDb = async () => {
  try {
    const documents = await db
      .collection("users")
      .orderBy("wins.total", "desc")
      .limit(10)
      .get();
    const leaderboard = documents.docs.map((doc) => {
      return {
        photoURL: doc.get("photoURL"),
        username: doc.get("username"),
        totalWins: doc.get("wins.total"),
      };
    });

    if (leaderboard.length) return leaderboard;
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: getLeaderBoardFromDb");
  }
};

// *Checks*
const dbCheckUsername = async (username) => {
  try {
    const check = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    if (check.empty) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: getUsernameFromDb");
  }
};

const confirmUserDocument = async (id) => {
  try {
    const document = await db.collection("users").doc(id).get();
    if (!document.exists) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: confirmUserDocument");
  }
};

// *Creates*
const addUserToDb = async (
  id,
  type,
  firstName,
  lastName,
  username,
  email,
  password,
  phoneNum,
  photoURL
) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .set({
        register_type: type === "Google" ? "Google" : "Standard",
        full_name: firstName + " " + lastName,
        username: username,
        email: email,
        password:
          type === "Google" && !password ? "Stored by google." : password,
        phone_number: phoneNum,
        photoURL: photoURL,
        wins: { total: 0, blackjack: 0, slots: 0 },
        balance: 0,
        quests_completed: [],
        creation_date: moment().format(),
      });

    return response;
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: addUserToDb");
  }
};

// *Updates*
const updateRealName = async (id, fullName) => {
  try {
    const response = await db.collection("users").doc(id).update({
      full_name: fullName,
    });
    return response;
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updateRealName");
  }
};

const updateUsername = async (id, username) => {
  try {
    const firebaseAuth = await admin.auth().updateUser(id, {
      displayName: username,
    });
    const firestore = await db.collection("users").doc(id).update({
      username: username,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updateUsername");
  }
};

const updateEmail = async (id, email) => {
  try {
    const firebaseAuth = await admin.auth().updateUser(id, {
      email: email,
    });
    const firestore = await db.collection("users").doc(id).update({
      email: email,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updateEmail");
  }
};

const updatePhoneNumber = async (id, phoneNum) => {
  try {
    const firebaseAuth = await admin.auth().updateUser(id, {
      phoneNumber: phoneNum,
    });
    const firestore = await db.collection("users").doc(id).update({
      phone_number: phoneNum,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updatePhoneNumber");
  }
};

const updateProfilePicture = async (id, photoURL) => {
  try {
    const firebaseAuth = await admin.auth().updateUser(id, {
      photoURL: photoURL,
    });
    const firestore = await db.collection("users").doc(id).update({
      photoURL: photoURL,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updatePhoneNumber");
  }
};

const updateWins = async (id, win) => {
  if (!win) {
    throw new Error(
      "The wins wasn't updated successfully! You must of forgot to pass the type as the req.query.win."
    );
  }

  try {
    const document = await db.collection("users").doc(id).get({
      fields: "wins",
    });

    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      const currentWins = await document.get("wins");

      const response = await db
        .collection("users")
        .doc(id)
        .update(
          win === "blackjack"
            ? {
                wins: {
                  ...currentWins,
                  blackjack: currentWins.blackjack + 1,
                  total: currentWins.total + 1,
                },
              }
            : win === "Slots"
            ? {
                wins: {
                  ...currentWins,
                  slots: currentWins.slots + 1,
                  total: currentWins.total + 1,
                },
              }
            : { wins: {} }
        );
      return response;
    }
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updateWins");
  }
};

const updateBalance = async (id, balance, isDeposit) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .update({
        balance: isDeposit
          ? admin.firestore.FieldValue.increment(balance)
          : balance,
      });
    return response;
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updateBalance");
  }
};

const updateCompletedQuests = async (id, quest, currBalance, reward) => {
  try {
    const newBalance = currBalance + reward;
    const response = await db
      .collection("users")
      .doc(id)
      .update({
        completed_quests: admin.firestore.FieldValue.arrayUnion(quest),
        balance: newBalance,
      });
    return response;
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updateCompletedQuests");
  }
};

// *Deletes*
const deleteUserFromDb = async (id) => {
  try {
    const response = await db.collection("users").doc(id).delete();
    return response;
  } catch (error) {
    logger.error(error);
    if (DEBUG) logger.error("DEBUGGER: auth.dal error: updatePhoneNumber");
  }
};

module.exports = {
  getAllUsersFromDb,
  getUserFromDb,
  getUserBalanceCompletedQuestsFromDb,
  getLeaderBoardFromDb,
  dbCheckUsername,
  confirmUserDocument,
  addUserToDb,
  updateRealName,
  updateUsername,
  updateEmail,
  updatePhoneNumber,
  updateProfilePicture,
  updateWins,
  updateBalance,
  updateCompletedQuests,
  deleteUserFromDb,
};
