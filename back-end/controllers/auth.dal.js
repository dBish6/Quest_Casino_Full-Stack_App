const { db } = require("../model/firebase");
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

// Get details you need for sidebar and call full user in profile.
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

const getUserWinsBalanceFromDb = async (id) => {
  try {
    const document = await db
      .collection("users")
      .doc(id)
      .get({
        fields: ["wins", "balance"],
      });
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return {
        wins: await document.get("wins"),
        balance: await document.get("balance"),
      };
    }
  } catch (error) {
    console.error(error);
    if (DEBUG)
      console.error("DEBUGGER: auth.dal error: getUserWinsBalanceFromDb");
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

// const getWinsFromDb = async (id) => {
//   try {
//     const document = await db.collection("users").doc(id).get();
//     if (!document.exists) {
//       return false;
//     } else {
//       return true;
//     }
//   } catch (error) {
//     console.error(error);
//     if (DEBUG) console.error("DEBUGGER: auth.dal error: getWinsFromDb");
//   }
// };

// TODO: Unique DisplayNames.
const getUsernameFromDb = async (id) => {
  try {
    const document = await db.collection("users").doc().get("username");
    if (!document.exists) {
      return "User doesn't exist.";
    } else {
      return document.data();
    }
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getUsernameFromDb");
  }
};

const addUserToDb = async (
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
        register_type: "Standard",
        full_name: firstName + " " + lastName,
        username: username,
        email: email,
        password: password,
        phone_number: phoneNum,
        photoURL: profilePic,
        wins: { blackjack: 0 },
        balance: "$0",
        favorites: [],
        // TODO:
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
        wins: 0,
        balance: "$0",
        favorites: [],
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

const updateWins = async (id, wins) => {
  try {
    const response = await db.collection("users").doc(id).update({
      wins: wins,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateWins");
  }
};

const updateBalance = async (id, balance) => {
  try {
    const response = await db
      .collection("users")
      .doc(id)
      .update({
        balance: "$" + balance,
      });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateBalance");
  }
};

const updateFavorites = async (id, favorite) => {
  try {
    const response = await db.collection("users").doc(id).update({
      // TODO: Pass the new array.
      favorites: favorite,
    });
    return response;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updateFavorites");
  }
};

const deleteUserFromDb = async (id) => {
  try {
    const document = await db.collection("users").doc(id).get();
    if (document.exists()) {
      const response = await document.ref.delete();
      return response;
    }
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: auth.dal error: updatePhoneNumber");
  }
};

module.exports = {
  getAllUsersFromDb,
  getUserFromDb,
  getUserWinsBalanceFromDb,
  confirmUserDocument,
  getUsernameFromDb,
  addUserToDb,
  addGoogleUserToDb,
  updateRealName,
  updateUsername,
  updateEmail,
  updatePhoneNumber,
  updateProfilePicture,
  updateWins,
  updateBalance,
  deleteUserFromDb,
};
