const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { admin } = require("../model/firebase");
const authDal = require("../controllers/auth.dal");

// Get All Users
router.get("/api/firebase/users", async (req, res) => {
  if (DEBUG) console.log("/api/firebase/users req:", req.params);
  try {
    const fsRes = await authDal.getAllUsersFromDb();
    if (!fsRes.length) {
      res.status(404).json({
        firestoreRes: fsRes,
        ERROR: "/api/firebase/users found no data.",
      });
    } else if (fsRes) {
      res.json(fsRes);
      if (DEBUG) console.log("DEBUGGER: Users was sent to client.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      fsRes: false,
      ERROR: "/api/firebase/users failed to send data.",
    });
  }
});

// Get Certain User
router.get("/api/firebase/users/:id", async (req, res) => {
  if (DEBUG) console.log("/api/firebase/users/:id req:", req.params);
  try {
    const fsRes = await authDal.getUserFromDb(req.params.id);

    if (fsRes === "Doesn't exist.") {
      res.status(404).json({
        user: fsRes,
        ERROR:
          "/api/firebase/users/:id failed to find the document of the requested user.",
      });
    } else if (fsRes) {
      res.json({ user: fsRes });
      if (DEBUG) console.log("DEBUGGER: User was sent to client.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      user: false,
      ERROR: "/api/firebase/users/:id failed to send data.",
    });
  }
});

// Add User
router.post("/api/firebase/register", async (req, res) => {
  if (DEBUG) console.log("/api/firebase/register body:", req.body);
  let authRes;

  try {
    // Adds user to auth.
    if (!req.body.phoneNum.length) {
      authRes = await admin.auth().createUser({
        displayName: req.body.username,
        email: req.body.email,
        password: req.body.password,
        photoURL: req.body.profilePic,
        emailVerified: false,
        disabled: false,
      });
    } else {
      const phoneNum = "+1" + req.body.phoneNum;
      authRes = await admin.auth().createUser({
        displayName: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: phoneNum,
        photoURL: req.body.profilePic,
        emailVerified: false,
        disabled: false,
      });
    }

    if (authRes) {
      const userId = authRes.uid;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      // Adds user to Firestore DB.
      const fsRes = await authDal.addUserToDb(
        userId,
        req.body.firstName,
        req.body.lastName,
        req.body.username,
        req.body.email,
        hashedPassword,
        !req.body.phoneNum.length ? null : req.body.phoneNum,
        req.body.profilePic
      );

      if (fsRes) {
        res.json({ registered: true, authUser: authRes, firestoreRes: fsRes });
        if (DEBUG)
          console.log("DEBUGGER: User was registered into the database.");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      registered: false,
      ERROR: "/user/api/firebase/register failed to send data.",
    });
  }
});

// Add Goggle User
router.post("/api/firebase/googleRegister", async (req, res) => {
  if (DEBUG) console.log("/api/firebase/googleRegister body:", req.body);
  try {
    const userExists = await authDal.confirmUserDocument(req.body.userId);

    if (!userExists) {
      const fsRes = await authDal.addGoogleUserToDb(
        req.body.userId,
        req.body.firstName,
        req.body.lastName,
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.phoneNum,
        req.body.profilePic
      );
      if (fsRes) {
        res.json({ registered: true, firestoreRes: fsRes });
        if (DEBUG)
          console.log(
            "DEBUGGER: Google user was registered into the database."
          );
      }
    } else {
      res.json({ registered: userExists });
      if (DEBUG) console.log("DEBUGGER: Google user already registered.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      registered: false,
      ERROR: "/user/api/firebase/googleRegister failed to send data.",
    });
  }
});

// Update User
router.patch("/api/firebase/update/:id", async (req, res) => {
  if (DEBUG)
    console.log("/api/firebase/update/:id req:", req.params, req.query);
  let fsRes;
  let authRes;
  const userId = req.params.id;

  try {
    if (req.query.name) {
      fsRes = await authDal.updateRealName(userId, req.query.name);
    } else if (req.query.username) {
      fsRes = await authDal.updateUsername(userId, req.query.username);
      authRes = admin.auth().updateUser(userId, {
        displayName: req.query.username,
      });
    } else if (req.query.email) {
      fsRes = await authDal.updateEmail(userId, req.query.email);
      authRes = admin.auth().updateUser(userId, {
        email: req.query.email,
      });
    }
    // else if (req.query.password) {
    //   const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //   fsRes = await authDal.updatePassword(userId, req.query.hashedPassword);
    // }
    else if (req.query.phoneNum) {
      fsRes = await authDal.updatePhoneNumber(userId, req.query.phoneNum);
      authRes = admin.auth().updateUser(userId, {
        phoneNumber: req.query.phoneNum,
      });
    } else {
      res.status(400).json({
        ERROR: "/user/api/firebase/update was given nothing to update.",
      });
    }

    if (fsRes) {
      res.json({ updated: true, firestoreRes: fsRes });
      if (DEBUG) console.log("DEBUGGER: User was updated to database.");
    } else if (authRes && fsRes) {
      res.json({ updated: true, authRes: authRes, firestoreRes: fsRes });
      if (DEBUG) console.log("DEBUGGER: User was updated to database.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      updated: false,
      ERROR: "/api/firebase/update/:id failed to send data.",
    });
  }
});

// Delete User, FIXME: Works but never ends.
router.delete("/api/firebase/delete/:id", async (req, res) => {
  if (DEBUG) console.log("/api/firebase/delete/:id req:", req.params);
  const userId = req.params.id;

  try {
    // Deletes auth user.
    const authRes = await admin.auth().deleteUser(userId);

    // Deletes Firestore user.
    const fsRes = await authDal.deleteUserFromDb(userId);

    if (authRes && fsRes) {
      res.json({ deleted: true, authUser: authRes, firestoreRes: fsRes });
      if (DEBUG) console.log("DEBUGGER: User was deleted from the database.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      deleted: false,
      ERROR: "/api/firebase/delete/:id failed to delete data.",
    });
  }
});

module.exports = router;
