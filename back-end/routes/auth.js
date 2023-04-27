const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { admin } = require("../model/firebase");
const authDal = require("../controllers/auth.dal");

// Get All Users
router.get("/api/firebase/users", async (req, res) => {
  if (DEBUG) console.log("/auth/api/firebase/users");
  let fsRes;

  try {
    if (req.query.leaderboard) {
      fsRes = await authDal.getLeaderBoardFromDb();
    } else {
      fsRes = await authDal.getAllUsersFromDb();
    }

    if (!fsRes.length) {
      res.status(404).json({
        firestoreRes: fsRes,
        ERROR: "/auth/api/firebase/users found no data.",
      });
    } else if (fsRes) {
      res.json(fsRes);
      if (DEBUG) console.log("DEBUGGER: Users was sent to client.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      fsRes: false,
      ERROR: "/auth/api/firebase/users failed to send data.",
    });
  }
});

// Get Certain User or Certain Details
router.get("/api/firebase/users/:id", async (req, res) => {
  if (DEBUG)
    console.log("/auth/api/firebase/users/:id req:", req.params, req.query);
  let fsRes;

  try {
    // if (req.query.wins && req.query.balance) {
    //   fsRes = await authDal.getUserWinsBalanceFromDb(req.params.id);
    // }
    if (req.query.balance && req.query.completedQuests) {
      fsRes = await authDal.getUserBalanceCompletedQuestsFromDb(req.params.id);
    } else if (req.query.wins) {
      fsRes = await authDal.getUserWinsFromDb(req.params.id);
    } else if (req.query.balance) {
      fsRes = await authDal.getUserBalanceFromDb(req.params.id);
    } else {
      fsRes = await authDal.getUserFromDb(req.params.id);
    }

    if (fsRes === "User doesn't exist.") {
      res.status(404).json({
        user: fsRes,
        ERROR:
          "/auth/api/firebase/users/:id failed to find the document of the requested user.",
      });
    } else if (fsRes) {
      res.json(fsRes);
      if (DEBUG)
        console.log(
          "DEBUGGER: User or desired user credential was sent to client."
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      user: false,
      ERROR: "/auth/api/firebase/users/:id failed to send data.",
    });
  }
});

// Add User
router.post("/api/firebase/register", async (req, res) => {
  if (DEBUG) console.log("/auth/api/firebase/register body:", req.body);
  let authRes;

  try {
    const usernameCheck = await authDal.dbCheckUsername(req.body.username);

    if (usernameCheck === false) {
      return res
        .status(400)
        .json({ registered: false, ERROR: "Username is already taken." });
    } else {
      // Adds user to auth.
      if (!req.body.phoneNum.length) {
        authRes = await admin.auth().createUser({
          displayName: req.body.username,
          email: req.body.email,
          password: req.body.password,
          emailVerified: false,
          disabled: false,
        });
      } else {
        authRes = await admin.auth().createUser({
          displayName: req.body.username,
          email: req.body.email,
          password: req.body.password,
          phoneNumber: req.body.phoneNum,
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
          !req.body.phoneNum.length ? null : req.body.phoneNum
        );

        if (fsRes) {
          res.json({
            registered: true,
            authUser: authRes,
            firestoreRes: fsRes,
          });
          if (DEBUG)
            console.log("DEBUGGER: User was registered into the database.");
        }
      }
    }
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-exists") {
      res.status(400).json(error);
    } else if (error.code === "auth/phone-number-already-exists") {
      res.status(400).json(error);
    } else if (error.code === "auth/too-many-requests") {
      res.status(429).json(error);
    } else {
      res.status(500).json({
        registered: false,
        ERROR: "/auth/api/firebase/register failed to send data.",
      });
    }
  }
});

// Add Goggle User
router.post("/api/firebase/googleRegister", async (req, res) => {
  if (DEBUG) console.log("/auth/api/firebase/googleRegister body:", req.body);
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
      ERROR: "/auth/api/firebase/googleRegister failed to send data.",
    });
  }
});

// Update User
router.patch("/api/firebase/update/:id", async (req, res) => {
  if (DEBUG)
    console.log("/auth/api/firebase/update/:id req:", req.params, req.query);
  let fsRes;
  let authRes;
  let winsRes;
  let balanceRes;
  const userId = req.params.id;

  try {
    if (req.query.win && req.query.winType && req.query.balance) {
      if (req.query.win === "true")
        winsRes = await authDal.updateWins(userId, req.query.winType);

      if (winsRes !== "User doesn't exist." || !winsRes) {
        balanceRes = await authDal.updateBalance(
          userId,
          parseInt(req.query.balance)
        );
      } else if (winsRes === "User doesn't exist.") {
        res.status(404).json({
          user: winsRes,
          ERROR:
            "/auth/api/firebase/update/:id failed to find the document by Id to update wins and balance.",
        });
      }
    } else if (req.query.name) {
      fsRes = await authDal.updateRealName(userId, req.query.name);
    } else if (req.query.username) {
      authRes = await admin.auth().updateUser(userId, {
        displayName: req.query.username,
      });
      fsRes = await authDal.updateUsername(userId, req.query.username);
    } else if (req.query.email) {
      authRes = await admin.auth().updateUser(userId, {
        email: req.query.email,
      });
      fsRes = await authDal.updateEmail(userId, req.query.email);
    } else if (req.query.phoneNum) {
      authRes = await admin.auth().updateUser(userId, {
        phoneNumber: req.query.phoneNum,
      });
      fsRes = await authDal.updatePhoneNumber(userId, req.query.phoneNum);
    } else if (req.query.profilePic) {
      authRes = await admin.auth().updateUser(userId, {
        photoURL: req.query.profilePic,
      });
      fsRes = await authDal.updateProfilePicture(userId, req.query.profilePic);
    } else if (req.query.win) {
      fsRes = await authDal.updateWins(userId);
    } else if (
      req.query.completedQuest &&
      req.query.balance &&
      req.query.reward
    ) {
      fsRes = await authDal.updateCompletedQuests(
        userId,
        req.query.completedQuest,
        parseInt(req.query.balance),
        parseInt(req.query.reward)
      );
    } else if (req.query.deposit) {
      fsRes = await authDal.updateBalance(
        userId,
        parseInt(req.query.deposit),
        true
      );
    } else {
      res.status(400).json({
        ERROR:
          "/auth/api/firebase/update/:id was given nothing to update or you missed a query.",
      });
      throw new Error(
        "/auth/api/firebase/update/:id was given nothing to update."
      );
    }

    if (authRes && fsRes) {
      res.json({ updated: true, authRes: authRes, firestoreRes: fsRes });
      if (DEBUG) console.log("DEBUGGER: User was updated to the database.");
    } else if (winsRes && balanceRes) {
      res.json({ updated: true, winsRes: winsRes, balanceRes: balanceRes });
      if (DEBUG) console.log("DEBUGGER: User was updated to the database.");
    } else if (balanceRes) {
      res.json({ updated: true, balanceRes: balanceRes });
      if (DEBUG) console.log("DEBUGGER: User was updated to the database.");
    } else if (fsRes) {
      res.json({ updated: true, firestoreRes: fsRes });
      if (DEBUG) console.log("DEBUGGER: User was updated to the database.");
    }
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-exists") {
      res.status(400).json(error);
    } else if (error.code === "auth/phone-number-already-exists") {
      res.status(400).json(error);
    } else if (error.code === "auth/too-many-requests") {
      res.status(429).json(error);
    } else {
      res.status(500).json({
        updated: false,
        ERROR: "/auth/api/firebase/update/:id failed to send data.",
      });
    }
  }
});

// Delete User.
router.delete("/api/firebase/delete/:id", async (req, res) => {
  if (DEBUG) console.log("/auth/api/firebase/delete/:id req:", req.params);
  const userId = req.params.id;

  try {
    // Deletes auth user.
    let authRes = await admin.auth().deleteUser(userId);
    authRes = `${userId} user was successfully deleted from firebase auth.`;
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
      ERROR: "/auth/api/firebase/delete/:id failed to delete data.",
    });
  }
});

module.exports = router;
