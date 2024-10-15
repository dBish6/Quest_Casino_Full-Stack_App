/**
 * Common fields excluded from a document from the DB to send to the client.
 */
const CLIENT_COMMON_EXCLUDE = "-_id -created_at -updated_at";
export default CLIENT_COMMON_EXCLUDE;
