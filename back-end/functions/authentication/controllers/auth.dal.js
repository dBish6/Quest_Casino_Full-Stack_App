const { auth, db, dbUtils } = require("../../model/firebaseConfig");
const { logger } = require("firebase-functions");
const { hash } = require("bcrypt");
const moment = require("moment");

// *Reads*
const getAllUsersFromDb = async () => {
  try {
    const collection = await db.collection("users").get();
    return collection.docs();
  } catch (error) {
    logger.error("auth.dal error: getAllUsersFromDb");
    logger.error(error);
  }
};

// FIXME: Getting every single document is pretty time consuming.
const getPlayerHighlightFromDb = async () => {
  let highlights = [];
  try {
    const documents = await db.collection("users").get({
      fields: ["username", "photoURL", "wins"],
    });
    documents.forEach((doc) => {
      const { username, photoURL, wins } = doc.data();
      highlights.push({ username, photoURL, wins });
    });
    highlights.sort(() => Math.random() - 0.5);
    highlights = highlights.slice(0, 8);
    return highlights;
  } catch (error) {
    logger.error("auth.dal error: getPlayerHighlightFromDb");
    throw error;
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
    logger.error("auth.dal error: getUserFromDb");
    throw error;
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
    const { balance, completed_quests } = document.data();
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return {
        balance: balance,
        completedQuests: completed_quests,
      };
    }
  } catch (error) {
    logger.error("auth.dal error: getUserBalanceCompletedQuestsFromDb");
    throw error;
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
    logger.error("auth.dal error: getLeaderBoardFromDb");
    throw error;
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
    logger.error("auth.dal error: dbCheckUsername");
    throw error;
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
    logger.error("auth.dal error: confirmUserDocument");
    throw error;
  }
};

// *Creates*
const addUserToDb = async (
  type,
  firstName,
  lastName,
  username,
  email,
  password,
  phoneNum,
  photoURL
) => {
  let firebaseAuth;
  let firestore;

  try {
    // Adds user to auth.
    if (!phoneNum) {
      firebaseAuth = await auth.createUser({
        displayName: username,
        email: email,
        password: password,
        emailVerified: false,
        disabled: false,
      });
    } else {
      firebaseAuth = await auth.createUser({
        displayName: username,
        email: email,
        password: password,
        phoneNumber: phoneNum,
        emailVerified: false,
        disabled: false,
      });
    }

    if (firebaseAuth) {
      const hashedPassword = await hash(password, 10);
      // Adds user to Firestore DB.
      firestore = await db
        .collection("users")
        .doc(firebaseAuth.uid)
        .set({
          register_type: type === "Google" ? "Google" : "Standard",
          full_name: firstName + " " + lastName,
          username: username,
          email: email,
          password:
            type === "Google" && !password
              ? "Stored by google."
              : hashedPassword,
          phone_number: phoneNum,
          photoURL: photoURL,
          wins: { total: 0, blackjack: 0, slots: 0 },
          balance: 0,
          completed_quests: [],
          creation_date: moment().format(),
        });
    }

    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error("auth.dal error: addUserToDb");
    throw error;
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
    logger.error("auth.dal error: updateRealName");
    throw error;
  }
};

const updateUsername = async (id, username) => {
  try {
    const firebaseAuth = await auth.updateUser(id, {
      displayName: username,
    });
    const firestore = await db.collection("users").doc(id).update({
      username: username,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error("auth.dal error: updateUsername");
    throw error;
  }
};

const updateEmail = async (id, email) => {
  try {
    const firebaseAuth = await auth.updateUser(id, {
      email: email,
    });
    const firestore = await db.collection("users").doc(id).update({
      email: email,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error("auth.dal error: updateEmail");
    throw error;
  }
};

const updatePhoneNumber = async (id, phoneNum) => {
  try {
    const firebaseAuth = await auth.updateUser(id, {
      phoneNumber: phoneNum,
    });
    const firestore = await db.collection("users").doc(id).update({
      phone_number: phoneNum,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error("auth.dal error: updatePhoneNumber");
    throw error;
  }
};

const updateProfilePicture = async (id, photoURL) => {
  try {
    const firebaseAuth = await auth.updateUser(id, {
      photoURL: photoURL,
    });
    const firestore = await db.collection("users").doc(id).update({
      photoURL: photoURL,
    });
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error("auth.dal error: updatePhoneNumber");
    throw error;
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
    logger.error("auth.dal error: updateWins");
    throw error;
  }
};

const updateBalance = async (id, balance, isDeposit) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .update({
        balance: isDeposit ? dbUtils.FieldValue.increment(balance) : balance,
      });
    return response;
  } catch (error) {
    logger.error("auth.dal error: updateBalance");
    throw error;
  }
};

const updateCompletedQuests = async (id, quest, currBalance, reward) => {
  try {
    const newBalance = currBalance + reward;
    const response = await db
      .collection("users")
      .doc(id)
      .update({
        completed_quests: dbUtils.FieldValue.arrayUnion(quest),
        balance: newBalance,
      });
    return response;
  } catch (error) {
    logger.error("auth.dal error: updateCompletedQuests");
    throw error;
  }
};

const updateActiveTimestamp = async (id) => {
  try {
    const response = await db.collection("users").doc(id).update({
      active_timestamp: moment().format(),
    });
    return response;
  } catch (error) {
    logger.error("auth.dal error: updateActiveTimestamp");
    throw error;
  }
};

// *Deletes*
const deleteUser = async (id) => {
  try {
    let firebaseAuth = await auth.deleteUser(id);
    firebaseAuth = `${id} user was successfully deleted from firebase auth.`;
    const firestore = await db.collection("users").doc(id).delete();
    return { firebaseAuth, firestore };
  } catch (error) {
    logger.error("auth.dal error: updatePhoneNumber");
    throw error;
  }
};

module.exports = {
  getAllUsersFromDb,
  getPlayerHighlightFromDb,
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
  updateActiveTimestamp,
  deleteUser,
};
