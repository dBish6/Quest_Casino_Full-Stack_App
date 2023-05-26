const { logger } = require("firebase-functions");
const { compare } = require("bcrypt");

// Verifies the cross site request forgery token by comparing the one sent from the client; mainly you
// verify this token on requests that change data.
const verifyCsrfToken = async (req, res, next) => {
  if (DEBUG) logger.debug("CSRF token from client: ", req.headers.csrf_token);

  try {
    const match = await compare(req.cookies.XSRF_TOKEN, req.headers.csrf_token);
    if (!match) {
      return res.status(401).json({
        ERROR: "CSRF token is missing or does not match.",
      });
    }
    if (DEBUG) logger.debug("DEBUGGER: CSRF Token Verified");
    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      ERROR: "Unexpected error while verifying CSRF token.",
    });
  }
};

module.exports = verifyCsrfToken;
