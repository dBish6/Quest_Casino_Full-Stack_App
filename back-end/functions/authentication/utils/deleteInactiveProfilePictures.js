const { logger } = require("firebase-functions");
const getInactiveDocuments = require("../../utils/getInactiveDocuments");
const { getAllUsersFromDb } = require("../controller/auth.dal");
const { storage } = require("../../model/firebaseConfig");

const deleteInactiveProfilePictures = async () => {
  const inactiveUsers = await getInactiveDocuments(getAllUsersFromDb);
  if (inactiveUsers) await deleteProfilePictures(inactiveUsers);

  logger.info("Inactive profile pictures check completed successfully.");
};

// Deletes profile pictures of inactive users.
const deleteProfilePictures = async (userIds) => {
  const bucket = storage.bucket();

  for (const userId of userIds) {
    const userFolder = `images/userProfilePics/${userId}`;

    const [files] = await bucket.getFiles({
      prefix: userFolder,
    });

    // Would just be one item in the storage bucket, but this is just in case.
    for (const file of files) {
      await file.delete();
      if (DEBUG) logger.debug(`Deleted file: ${file.name} from user ${userId}`);
    }
  }
};

module.exports = deleteInactiveProfilePictures;
