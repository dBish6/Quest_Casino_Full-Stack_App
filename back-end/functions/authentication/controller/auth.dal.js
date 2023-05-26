const { auth, db, dbUtils } = require("../../model/firebaseConfig");
const { logger } = require("firebase-functions");
const { hash } = require("bcrypt");
const moment = require("moment");

// *Reads*
const getAllUsersFromDb = async () => {
  try {
    const collection = await db.collection("users").get();
    return collection.docs.map((doc) => doc.data());
  } catch (error) {
    logger.error("auth.dal error: getAllUsersFromDb");
    logger.error(error);
  }
};

const getPlayerHighlightFromDb = async () => {
  const randomIds = [];

  try {
    const queryList = await db.collection("users").listDocuments();
    // Shuffles all the documents real nice and creates a array of a max of 8 random IDs.
    for (let i = queryList.length - 1; i >= 0 && randomIds.length < 8; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let temp = queryList[i];
      queryList[i] = queryList[randomIndex];
      queryList[randomIndex] = temp;
      randomIds.push(queryList[i].id);
    }

    const querySnapshot = await db
      .collection("users")
      .where(dbUtils.FieldPath.documentId(), "in", randomIds)
      .select("username", "photoURL", "wins.total")
      .get();
    console.log(
      "data",
      querySnapshot.docs.map((docs) => docs.data())
    );
    if (!querySnapshot.empty)
      return querySnapshot.docs.map((docs) => docs.data());
  } catch (error) {
    logger.error("auth.dal error: getPlayerHighlightFromDb");
    throw error;
  }
};

// Wasn't necessary to get balance, completed_quests and win_streaks with this function
// because we get those fields on page load; this is mainly for the profile page.
const getUserFromDb = async (id) => {
  try {
    // const document = await db.collection("users").doc(id).get();
    const querySnapshot = await db
      .collection("users")
      .where(dbUtils.FieldPath.documentId(), "==", id)
      .select(
        "full_name",
        "username",
        "email",
        "photoURL",
        "phone_number",
        "wins"
      )
      .get();

    if (querySnapshot.empty) {
      return "User doesn't exist.";
    } else {
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    logger.error("auth.dal error: getUserFromDb");
    throw error;
  }
};

const getUserBalanceCompletedQuestsFromDb = async (id) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where(dbUtils.FieldPath.documentId(), "==", id)
      .select("balance", "completed_quests")
      .get();

    if (querySnapshot.empty) {
      return "User doesn't exist.";
    } else {
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    logger.error("auth.dal error: getUserBalanceCompletedQuestsFromDb");
    throw error;
  }
};

const getLeaderBoardFromDb = async () => {
  try {
    const querySnapshot = await db
      .collection("users")
      .orderBy("wins.total", "desc")
      .select("username", "photoURL", "wins.total")
      .limit(10)
      .get();

    if (!querySnapshot.empty)
      return querySnapshot.docs.map((docs) => docs.data());
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
  let firebaseAuth;
  let firestore;

  try {
    // Adds user to auth.
    if (type !== "Google" && !id) {
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
    } else {
      firebaseAuth = "Registered via google.";
    }
    if (firebaseAuth) {
      // Adds user to Firestore DB.
      const userId = !id ? firebaseAuth.uid : id;
      firestore = await db
        .collection("users")
        .doc(userId)
        .set({
          register_type: type === "Google" ? "Google" : "Standard",
          full_name: firstName + " " + lastName,
          username: username,
          email: email,
          password:
            type === "Google" && !password
              ? "Stored by google."
              : await hash(password, 10),
          phone_number: phoneNum,
          photoURL: photoURL,
          wins: { blackjack: 0, slots: 0, total: 0 },
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

const updateWins = async (id, win, game) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .update(
        game === "blackjack"
          ? {
              "wins.blackjack": dbUtils.FieldValue.increment(1),
              "wins.total": dbUtils.FieldValue.increment(1),
            }
          : game === "Slots"
          ? {
              "wins.slots": dbUtils.FieldValue.increment(1),
              "wins.total": dbUtils.FieldValue.increment(1),
            }
          : undefined
      );

    return response;
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
