const { logger } = require("firebase-functions");
const { updateActiveTimestamp } = require("../controllers/auth.dal");

// Add a new activity timestamp to the user.
const timestamp = async (req, res, next) => {
  if (DEBUG) logger.debug("Updating timestamp.");
  const userId = req.decodedClaims
    ? req.decodedClaims.sub
    : req.user
    ? req.user.uid
    : undefined;
  if (!userId)
    return res.status(404).json({
      response: null,
      ERROR: "The user ID was not found while updating the user's timestamp.",
    });

  let response;
  try {
    response = await updateActiveTimestamp(userId);
    next();
  } catch (error) {
    return res.status(500).json({
      response: response,
      ERROR: "Failed to update activity timestamp.",
    });
  }
};

module.exports = timestamp;
