const { logger } = require("firebase-functions");
const { auth } = require("../../model/firebaseConfig");

// Verifies the user's idToken and send back the user.
const verifyUserToken = async (req, res, next) => {
  if (DEBUG) logger.debug("idToken header: ", req.headers.authorization);

  try {
    const authToken = req.headers.authorization || "",
      { uid, email, email_verified, name, phone_number, picture } =
        await auth.verifyIdToken(authToken);

    req.idToken = authToken;
    req.user = {
      uid,
      email,
      emailVerified: email_verified,
      displayName: name,
      phoneNumber: phone_number,
      photoURL: picture,
    };
    if (DEBUG) logger.debug("DEBUGGER: Id Token Verified");
    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({
      ERROR: "Invalid or missing token.",
    });
  }
};

module.exports = verifyUserToken;
