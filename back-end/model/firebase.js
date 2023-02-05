const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./credentials.json");
// const JSONcredentials = JSON.stringify(serviceAccount);
// console.log("yup:", JSONcredentials);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

module.exports = { admin, db };
