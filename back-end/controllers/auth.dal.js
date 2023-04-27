const { admin, db } = require("../model/firebase");
const moment = require("moment");

const getAllUsersFromDb = async () => {
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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getAllUsersFromDb");
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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getUserFromDb");
  }
};

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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getUsernameFromDb");
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
    console.error(error);
    if (DEBUG)
      console.error("DEBUGGER: auth.dal error: getUserWinsBalanceFromDb");
  }
};

const getUserWinsFromDb = async (id) => {
  try {
    const document = await db.collection("users").doc(id).get({
      fields: "wins",
    });
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return await document.get("wins");
    }
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getUserWinsFromDb");
  }
};

const getUserBalanceFromDb = async (id) => {
  try {
    const document = await db.collection("users").doc(id).get({
      fields: "balance",
    });
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return await document.get("balance");
    }
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getUserBalanceFromDb");
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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getLeaderBoardFromDb");
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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: confirmUserDocument");
  }
};

const addUserToDb = async (
  id,
  firstName,
  lastName,
  username,
  email,
  password,
  phoneNum
) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .set({
        register_type: "Standard",
        full_name: firstName + " " + lastName,
        username: username,
        email: email,
        password: password,
        phone_number: phoneNum,
        photoURL: "",
        wins: { total: 0, blackjack: 0, slots: 0 },
        balance: 0,
        quests_completed: [],
        creation_date: moment().format(),
      });

    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: addUserToDb");
  }
};

const addGoogleUserToDb = async (
  id,
  firstName,
  lastName,
  username,
  email,
  password,
  phoneNum,
  profilePic
) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .set({
        register_type: "Google",
        full_name: firstName + " " + lastName,
        username: username,
        email: email,
        password: password,
        phone_number: phoneNum,
        photoURL: profilePic,
        wins: { total: 0, blackjack: 0, slots: 0 },
        balance: 0,
        quests_completed: [],
        creation_date: moment().format(),
      });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: addGoogleUserToDb");
  }
};

const updateRealName = async (id, fullName) => {
  try {
    const response = await db.collection("users").doc(id).update({
      full_name: fullName,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateRealName");
  }
};

const updateUsername = async (id, username) => {
  try {
    const response = await db.collection("users").doc(id).update({
      username: username,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateUsername");
  }
};

const updateEmail = async (id, email) => {
  try {
    const response = await db.collection("users").doc(id).update({
      email: email,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateEmail");
  }
};

const updatePhoneNumber = async (id, phoneNum) => {
  try {
    const response = await db.collection("users").doc(id).update({
      phone_number: phoneNum,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updatePhoneNumber");
  }
};

const updateProfilePicture = async (id, photoURL) => {
  try {
    const response = await db.collection("users").doc(id).update({
      photoURL: photoURL,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updatePhoneNumber");
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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateWins");
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
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateBalance");
  }
};

const updateCompletedQuests = async (id, quest, currBalance, reward) => {
  try {
    console.log("quest", quest, "currBalance", currBalance, "reward", reward);
    const newBalance = currBalance + reward;
    console.log("newBalance", newBalance);
    const response = await db
      .collection("users")
      .doc(id)
      .update({
        completed_quests: admin.firestore.FieldValue.arrayUnion(quest),
        balance: newBalance,
      });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateCompletedQuests");
  }
};

const deleteUserFromDb = async (id) => {
  try {
    const response = await db.collection("users").doc(id).delete();
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updatePhoneNumber");
  }
};

module.exports = {
  getAllUsersFromDb,
  getUserFromDb,
  dbCheckUsername,
  getUserBalanceCompletedQuestsFromDb,
  getUserWinsFromDb,
  getUserBalanceFromDb,
  getLeaderBoardFromDb,
  confirmUserDocument,
  addUserToDb,
  addGoogleUserToDb,
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
