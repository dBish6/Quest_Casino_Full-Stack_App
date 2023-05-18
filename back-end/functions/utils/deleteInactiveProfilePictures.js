const { region, logger } = require("firebase-functions");
const { getAllUsersFromDb } = require("../authentication/controllers/auth.dal");
const moment = require("moment");
const { storage } = require("../model/firebaseConfig");

// Cloud Function triggered daily to delete inactive users profile pictures.
exports.deleteInactiveProfilePictures = region("northamerica-northeast1")
  .pubsub.schedule("every 24 hours")
  .onRun(async (context) => {
    if (DEBUG) logger.debug("context", context);
    const inactiveUsers = await getInactiveUsers();
    await deleteProfilePictures(inactiveUsers);
    logger.info("Inactive profile pictures check completed successfully.");
  });

// Checks for inactive users.
const getInactiveUsers = async () => {
  const users = await getAllUsersFromDb();
  const inactiveUsers = [];

  users.forEach((doc) => {
    if (doc.active_timestamp) {
      const lastActivityTimestamp = moment(doc.active_timestamp);
      const sixtyDaysAgo = moment().subtract(60, "days");

      if (lastActivityTimestamp.isSameOrBefore(sixtyDaysAgo)) {
        inactiveUsers.push(doc.id);
      }
    }
  });
  if (DEBUG) logger.debug("inactiveUsers", inactiveUsers);

  return inactiveUsers;
};

// Deletes profile pictures of inactive users.
const deleteProfilePictures = async (userIds) => {
  const bucket = storage.bucket();

  for (const userId of userIds) {
    const userFolder = `images/userProfilePics/${userId}`;

    const [files] = await bucket.getFiles({
      prefix: userFolder,
    });

    // Would just one item in the storage bucket, but this is just in case.
    for (const file of files) {
      await file.delete();
      if (DEBUG) logger.debug(`Deleted file: ${file.name}`);
    }
  }
};
