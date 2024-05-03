import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, inMemoryPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const { VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID, VITE_FIREBASE_MEASUREMENT_ID } = process.env;

const app = !getApps().length
  ? initializeApp({
      apiKey: VITE_FIREBASE_API_KEY,
      authDomain: VITE_FIREBASE_AUTH_DOMAIN,
      projectId: VITE_FIREBASE_PROJECT_ID,
      storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: VITE_FIREBASE_APP_ID,
      measurementId: VITE_FIREBASE_MEASUREMENT_ID,
    })
  : getApp();

const auth = getAuth(app);
// Sets the Persistence to "NONE" because the back-end handles the user session and data.
auth.setPersistence(inMemoryPersistence);

if (app.name && typeof window !== "undefined") getAnalytics(app);

export { auth };
