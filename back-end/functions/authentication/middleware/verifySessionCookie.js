const { auth } = require("../../model/firebaseConfig");
const { logger } = require("firebase-functions");

// Verifies that a session cookie persists.
const verifySessionCookie = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session || "",
      decodedClaims = await auth.verifySessionCookie(sessionCookie);

    req.decodedClaims = decodedClaims;
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
