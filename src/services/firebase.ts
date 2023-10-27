import admin, { ServiceAccount } from "firebase-admin";
import serviceAccountKey from "../service-account-key.json";

let db: admin.firestore.Firestore;

export const initializeFirebase = () => {
  if (!admin.apps.length) { // Check if app is already initialized
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
    });

    db = admin.firestore();
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Firebase has not been initialized. Please call initializeFirebase() first.");
  }

  return db;
};
