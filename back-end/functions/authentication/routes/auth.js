const { Router } = require("express");
const router = Router();
const { logger } = require("firebase-functions");

const { hash } = require("bcrypt");
const { randomUUID } = require("crypto");
const sendEmail = require("../../utils/sendEmail");

const {
  verifyUserToken,
  verifyCsrfToken,
} = require("../middleware/verifyTokens");
const verifySessionCookie = require("../middleware/verifySessionCookie");
const timestamp = require("../middleware/timestamp");
const { auth } = require("../../model/firebaseConfig");
const authDal = require("../controllers/auth.dal");

// Get All Users
router.get("/api/firebase/users", async (req, res) => {
  if (DEBUG) logger.debug("/auth/api/firebase/users");
  let fsRes;

  try {
    if (req.query.leaderboard) {
      fsRes = await authDal.getLeaderBoardFromDb();
    } else {
      fsRes = await authDal.getPlayerHighlightFromDb();
    }

    if (!fsRes.length) {
      return res.status(404).json({
        firestoreRes: fsRes,
        ERROR: "/auth/api/firebase/users found no data.",
      });
    } else if (fsRes) {
      if (DEBUG) logger.debug("DEBUGGER: Users was sent to client.");
      return res.status(200).json(fsRes);
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      fsRes: false,
      ERROR: "/auth/api/firebase/users failed to send users.",
    });
  }
});

// Get Certain User or Certain Details
router.get("/api/firebase/users/:id", verifySessionCookie, async (req, res) => {
  if (DEBUG)
    logger.debug("/auth/api/firebase/users/:id req:", req.params, req.query);
  let fsRes;

  try {
    if (req.query.balance && req.query.completedQuests) {
      fsRes = await authDal.getUserBalanceCompletedQuestsFromDb(req.params.id);
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
      if (DEBUG)
        logger.debug(
          "DEBUGGER: User or desired user credential was sent to the client."
        );
      return res.status(200).json(fsRes);
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      user: false,
      ERROR: "/auth/api/firebase/users/:id failed to send user data.",
    });
  }
});

// When logged in, verify the user's idToken and create a session cookie.
router.post(
  "/api/firebase/login",
  verifyUserToken,
  timestamp,
  async (req, res) => {
    if (DEBUG) logger.debug("/auth/api/firebase/login");

    try {
      // Creates session cookie and CSRF cookie.
      const expiresIn = 1000 * 60 * 60 * 24, // One day.
        sessionCookie = await auth.createSessionCookie(req.idToken, {
          expiresIn,
        }),
        options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
          sameSite: "None",
        };
      res.cookie("session", sessionCookie, options);
      const csrfToken = randomUUID();
      console.log("csrfToken", csrfToken);
      res.cookie("XSRF_TOKEN", csrfToken, options);

      return res.status(200).json({
        session: true,
        user: req.user,
        token: await hash(csrfToken, 10),
        message: "Session cookie created successfully.",
      });
    } catch (error) {
      logger.error(error);
      req.session.csrfToken && res.clearCookie("session");
      req.cookies.XSRF_TOKEN && res.clearCookie("XSRF_TOKEN");
      return res.status(500).json({
        session: false,
        ERROR: "/api/firebase/login failed to create the session.",
      });
    }
  }
);

// When session cookie is created, this route maintains the current set user.
router.get(
  "/api/firebase/user/session",
  verifySessionCookie,
  timestamp,
  async (req, res) => {
    if (DEBUG) logger.debug("/auth/api/firebase/users/session");

    try {
      const { uid, email, email_verified, name, phone_number, picture } =
        req.decodedClaims;
      const emailLink = await auth.generateSignInWithEmailLink(email, {
        handleCodeInApp: true,
        url: "http://localhost:3000",
      });

      return res.status(200).json({
        session: true,
        authUser: {
          uid,
          email,
          emailVerified: email_verified,
          displayName: name,
          phoneNumber: phone_number,
          photoURL: picture,
        },
        token: await hash(req.cookies.XSRF_TOKEN, 10),
        emailLink: emailLink,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        session: false,
        ERROR:
          "/api/firebase/users/session failed to send session confirmation.",
      });
    }
  }
);

// TODO: auth.generatePasswordResetLink().

router.post(
  "/api/firebase/user/emailVerification",
  verifySessionCookie,
  async (req, res) => {
    if (DEBUG) logger.debug("/auth/api/firebase/user/emailVerification");

    try {
      const link = await auth.generateEmailVerificationLink(req.body.email);

      const html = `Greetings, thank you so much for your endeavour through Quest Casino.<br><br>
        To verify your email, <a href="${link}"> click here </a>.`,
        info = await sendEmail(req.body.email, "Email Verification", html);

      return res.status(200).json({
        email: req.body.email,
        emailSent: info.messageId,
      });
    } catch (error) {
      logger.error(error);
      if (error.code === "auth/too-many-requests") {
        return res.status(429).json(error);
      } else {
        return res.status(500).json({
          email: req.body.email,
          emailSent: false,
          ERROR:
            "/api/firebase/users/session failed to send email verification link.",
        });
      }
    }
  }
);

// Clears the session cookie on logout.
router.post("/api/firebase/logout", verifySessionCookie, async (req, res) => {
  if (DEBUG) logger.debug("/auth/api/firebase/logout");

  // FIXME: On logout I am still getting "Some cookies are misusing the recommended “SameSite“ attribute" warning.
  try {
    res.clearCookie("session");
    res.clearCookie("XSRF_TOKEN");
    await auth.revokeRefreshTokens(req.decodedClaims.sub);

    return res.status(200).json({
      session: "Cleared",
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      session: "If any",
      ERROR: "/api/firebase/logout failed to clear session.",
    });
  }
});

// Add User
router.post("/api/firebase/register", async (req, res) => {
  if (DEBUG) logger.debug("/auth/api/firebase/register body:", req.body);

  try {
    // If the user uses the Google register.
    if (req.body.type === "Google" && req.body.userId) {
      const userExists = await authDal.confirmUserDocument(req.body.userId);
      if (!userExists) {
        const fsRes = await authDal.addUserToDb(
          req.body.userId,
          req.body.type,
          req.body.firstName,
          req.body.lastName,
          req.body.username,
          req.body.email,
          req.body.password,
          req.body.phoneNum,
          req.body.profilePic
        );
        if (fsRes) {
          if (DEBUG)
            logger.debug(
              "DEBUGGER: Google user was registered into the database."
            );
          return res
            .status(200)
            .json({ registered: true, firestoreRes: fsRes });
        }
      } else {
        if (DEBUG)
          logger.debug(
            "DEBUGGER: Google user already registered; continue with log in."
          );
        return res.status(202).json({ registered: userExists });
      }
      // If the user registers manually.
    } else if (req.body.type === "Standard") {
      const usernameCheck = await authDal.dbCheckUsername(req.body.username);
      if (usernameCheck === false) {
        return res
          .status(400)
          .json({ registered: false, ERROR: "Username is already taken." });
      } else {
        // Creates auth user & Firestore user.
        const response = await authDal.addUserToDb(
          req.body.type,
          req.body.firstName,
          req.body.lastName,
          req.body.username,
          req.body.email,
          req.body.password,
          !req.body.phoneNum.length ? null : req.body.phoneNum,
          null
        );

        if (response) {
          if (DEBUG)
            logger.debug("DEBUGGER: User was registered into the database.");
          return res.status(200).json({
            registered: true,
            authUser: response.firebaseAuth,
            firestoreRes: response.firestore,
          });
        }
      }
    } else {
      res.status(500).json({
        ERROR:
          '/api/firebase/register was not given a register type; must be "Google" or "Standard".',
      });
      throw new Error(
        '/api/firebase/register was not given a register type; must be "Google" or "Standard".'
      );
    }
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json(error);
    } else if (error.code === "auth/phone-number-already-exists") {
      return res.status(400).json(error);
    } else if (error.code === "auth/too-many-requests") {
      return res.status(429).json(error);
    } else {
      logger.error(error);
      return res.status(500).json({
        registered: false,
        ERROR: "/auth/api/firebase/register failed to add user.",
      });
    }
  }
});

// Update User
router.patch(
  "/api/firebase/update/:id",
  verifyCsrfToken,
  verifySessionCookie,
  async (req, res) => {
    if (DEBUG)
      logger.debug(
        "/auth/api/firebase/update/:id req:",
        req.params,
        req.query,
        req.body
      );
    const userId = req.params.id;
    let fsRes;
    let authRes;
    let winsRes;
    let balanceRes;

    try {
      if (req.query.win && req.query.winType && req.body.balance) {
        if (req.query.win === "true")
          winsRes = await authDal.updateWins(userId, req.query.winType);

        if (winsRes !== "User doesn't exist." || !winsRes) {
          balanceRes = await authDal.updateBalance(userId, req.body.balance);
        } else if (winsRes === "User doesn't exist.") {
          return res.status(404).json({
            user: winsRes,
            ERROR:
              "/auth/api/firebase/update/:id failed to find the document by Id to update wins and balance.",
          });
        }
      } else if (req.body.deposit) {
        fsRes = await authDal.updateBalance(
          userId,
          parseInt(req.body.deposit),
          true
        );
      } else if (req.body.name) {
        fsRes = await authDal.updateRealName(userId, req.body.name);
      } else if (req.body.username) {
        const response = await authDal.updateUsername(
          userId,
          req.body.username
        );
        authRes = response.firebaseAuth;
        fsRes = response.firestore;
      } else if (req.body.email) {
        const response = await authDal.updateEmail(userId, req.body.email);
        authRes = response.firebaseAuth;
        fsRes = response.firestore;
      } else if (req.body.phoneNum) {
        const response = await authDal.updatePhoneNumber(
          userId,
          req.body.phoneNum
        );
        authRes = response.firebaseAuth;
        fsRes = response.firestore;
      } else if (req.body.profilePic) {
        const response = await authDal.updateProfilePicture(
          userId,
          req.body.profilePic
        );
        authRes = response.firebaseAuth;
        fsRes = response.firestore;
      } else if (
        req.query.completedQuest &&
        req.body.balance &&
        req.body.reward
      ) {
        fsRes = await authDal.updateCompletedQuests(
          userId,
          req.query.completedQuest,
          req.body.balance,
          req.body.reward
        );
      } else {
        res.status(400).json({
          ERROR:
            "/auth/api/firebase/update/:id was given nothing to update or you missed a query.",
        });
        // throw new Error(
        //   "/auth/api/firebase/update/:id was given nothing to update."
        // );
      }

      if (authRes && fsRes) {
        if (DEBUG) logger.debug("DEBUGGER: User was updated to the database.");
        return res
          .status(200)
          .json({ updated: true, authRes: authRes, firestoreRes: fsRes });
      } else if (winsRes && balanceRes) {
        if (DEBUG) logger.debug("DEBUGGER: User was updated to the database.");
        return res.status(200).json({
          updated: true,
          winsRes: winsRes,
          balanceRes: balanceRes,
        });
      } else if (balanceRes) {
        if (DEBUG) logger.debug("DEBUGGER: User was updated to the database.");
        return res.status(200).json({ updated: true, balanceRes: balanceRes });
      } else if (fsRes) {
        if (DEBUG) logger.debug("DEBUGGER: User was updated to the database.");
        return res.status(200).json({ updated: true, firestoreRes: fsRes });
      }
    } catch (error) {
      logger.error(error);
      if (error.code === "auth/email-already-exists") {
        return res.status(400).json(error);
      } else if (error.code === "auth/phone-number-already-exists") {
        return res.status(400).json(error);
      } else if (error.code === "auth/too-many-requests") {
        return res.status(429).json(error);
      } else {
        return res.status(500).json({
          updated: false,
          ERROR: "/auth/api/firebase/update/:id failed to update user.",
        });
      }
    }
  }
);

// Delete User
router.delete(
  "/api/firebase/delete/:id",
  verifyCsrfToken,
  verifySessionCookie,
  async (req, res) => {
    if (DEBUG) logger.debug("/auth/api/firebase/delete/:id req:", req.params);

    try {
      res.clearCookie("session");
      res.clearCookie("XSRF_TOKEN");
      await auth.revokeRefreshTokens(req.decodedClaims.sub);
      // Deletes auth user & Firestore user.
      const response = await authDal.deleteUser(req.params.id);

      if (response) {
        if (DEBUG)
          logger.debug("DEBUGGER: User was deleted from the database.");
        return res.json({
          deleted: true,
          authRes: response.firebaseAuth,
          firestoreRes: response.firestore,
        });
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        deleted: false,
        ERROR: "/auth/api/firebase/delete/:id failed to delete data.",
      });
    }
  }
);

module.exports = router;
