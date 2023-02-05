const { db } = require("../model/firebase");
const moment = require("moment");

const getAllUsersFromDb = async () => {
  let documents = [];
  try {
    const collection = await db.collection("users").get();
    const response = collection.docs.map((doc) => documents.push(doc.data()));
    if (response) {
      documents.sort(() => Math.random() * documents.length);
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
    if (DEBUG) console.error("DEBUGGER: auth.dal error: getUserDocumentById");
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
// const getUsernameFromDb = async () => {
//   let response;
//   try {
//     const document = await db.collection("users").doc(id).get();
//     if (!document.exists) {
//       return (response = "User doesn't exist.");
//     } else {
//       return (response = document.data());
//     }
//   } catch (error) {
//     console.error(error);
//     if (DEBUG) console.error("DEBUGGER: auth.dal error: getUsernameFromDb");
//   }
// };

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
        wins: 0,
        favorites: [],
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
        favorites: [],
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

// const updatePassword = async (id, password) => {
//   try {
//     const response = await db.collection("users").doc(id).update({
//       password: password,
//     });
//     return response;
//   } catch (error) {
//     console.error(error);
//     if (DEBUG) console.error("DEBUGGER: auth.dal error: updatePassword");
//   }
// };

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

// const updateWins = async (id, phoneNum) => {
//   try {
//     const response = await db.collection("users").doc(id).update({
//       phone_number: phoneNum,
//     });
//     return response;
//   } catch (error) {
//     console.error(error);
//     if (DEBUG) console.error("DEBUGGER: auth.dal error: updateWins");
//   }
// };

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
  confirmUserDocument,
  addUserToDb,
  addGoogleUserToDb,
  updateRealName,
  updateUsername,
  updateEmail,
  updatePhoneNumber,
  deleteUserFromDb,
};
