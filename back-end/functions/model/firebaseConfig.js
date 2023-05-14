const admin = require("firebase-admin");
const serviceAccount = require("./credentials.json");

const firebaseConfig = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(firebaseConfig);

module.exports = { admin, db };
