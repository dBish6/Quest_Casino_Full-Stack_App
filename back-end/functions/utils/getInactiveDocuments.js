const { logger } = require("firebase-functions");
const moment = require("moment");

// Checks for inactive firestore documents and returns them.
const getInactiveDocuments = async (getAllDocs) => {
  const docs = await getAllDocs();
  const inactiveDocs = [];

  docs.forEach((doc) => {
    if (doc.timestamp) {
      const lastActivityTimestamp = moment(doc.timestamp);
      const sixtyDaysAgo = moment().subtract(60, "days");

      if (lastActivityTimestamp.isSameOrBefore(sixtyDaysAgo)) {
        inactiveDocs.push(doc.id);
      }
    }
  });
  if (DEBUG) logger.debug("inactiveDocs", inactiveDocs);

  return inactiveDocs;
};

module.exports = getInactiveDocuments;
