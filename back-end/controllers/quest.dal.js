const { db } = require("../model/firebase");

const getAllQuestsFromDb = async () => {
  try {
    const collection = await db.collection("quests").get();
    const documents = collection.docs.map((doc) => doc.data());
    if (documents.length) return documents;
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: quest.dal error: getAllQuestsFromDb");
  }
};

const getQuestFromDb = async (title) => {
  try {
    const document = await db.collection("quests").doc(title).get();
    if (!document.exists) {
      return "Quest doesn't exist.";
    } else {
      return document.data();
    }
  } catch (error) {
    console.error(error);
    if (DEBUG) console.error("DEBUGGER: quest.dal error: getQuestFromDb");
  }
};

module.exports = { getAllQuestsFromDb, getQuestFromDb };
