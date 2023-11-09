import admin from "firebase-admin";
import { SERVICE_ACCOUNT_KEY } from "./environmentVariables";

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;

const initializeFirebase = () => {
  if (!admin.apps.length) {

    admin.initializeApp({
      credential: admin.credential.cert(SERVICE_ACCOUNT_KEY),
    });

    db = admin.firestore();
    auth = admin.auth();
  }
};

export const getDatabase = () => {
  if (!db) {
    initializeFirebase();
  }

  return db;
};

export const getAuth = () => {
  if (!auth) {
    initializeFirebase();
  }

  return auth;
}