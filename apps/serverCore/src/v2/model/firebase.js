import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const model = initializeApp(),
  db = getFirestore(model),
  auth = getAuth(model);

export { db, auth };
