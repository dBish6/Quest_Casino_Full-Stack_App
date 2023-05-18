const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");

const firebaseConfig = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth(firebaseConfig),
  db = admin.firestore(firebaseConfig),
  dbUtils = admin.firestore,
  storage = admin.storage(firebaseConfig);

module.exports = { auth, db, dbUtils, storage };
