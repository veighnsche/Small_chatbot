import admin from "firebase-admin";
import { serviceAccountKey } from "../service-account-key";

let db: admin.firestore.Firestore;

const initializeFirebase = () => {
  if (!admin.apps.length) {

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
    });

    db = admin.firestore();
  }
};

export const getDatabase = () => {
  if (!db) {
    initializeFirebase();
  }

  return db;
};
