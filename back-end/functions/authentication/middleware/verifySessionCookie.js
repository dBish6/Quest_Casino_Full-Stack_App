const { logger } = require("firebase-functions");
const { admin } = require("../../model/firebaseConfig");

// Verifies that a session cookie persists.
const verifySessionCookie = async (req, res, next) => {
  if (DEBUG) logger.debug("req.cookies on check session: ", req.cookies);

  try {
    const sessionCookie = req.cookies.session || "";
    const { uid, email, email_verified, name, phone_number, picture } =
      await admin.auth().verifySessionCookie(sessionCookie);
    req.decodedClaims = {
      uid,
      email,
      emailVerified: email_verified,
      name,
      phoneNumber: phone_number,
      picture,
    };
    if (DEBUG) logger.debug("DEBUGGER: Session Cookie Verified");
    next();
  } catch (error) {
    if (DEBUG) logger.error(error);
    if (error.code === "auth/session-cookie-expired") {
      req.cookies.session && res.clearCookie("session");
      req.cookies.XSRF_TOKEN && res.clearCookie("XSRF_TOKEN");

      return res.status(401).json({
        session: false,
        ERROR: "Session cookie expired.",
      });
    } else {
      return res.status(401).json({
        session: false,
        ERROR: "Invalid or missing session cookie.",
      });
    }
  }
};

module.exports = verifySessionCookie;
