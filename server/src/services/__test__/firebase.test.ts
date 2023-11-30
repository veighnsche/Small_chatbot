// Assuming your file is named firebase.js
import * as firebase from "../firebase";
import admin from "firebase-admin";

jest.mock("firebase-admin", () => {
  return {
    apps: [],
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
    firestore: jest.fn(() => "mockFirestoreInstance"), // Return mock instance
    auth: jest.fn(() => "mockAuthInstance"), // Return mock instance
  };
});

describe("Firebase Initialization", () => {
  test("initializeFirebase should initialize Firebase if not already initialized", () => {
    firebase.getDatabase();
    expect(admin.initializeApp).toHaveBeenCalled();
  });

  test("getDatabase should return a Firestore instance", () => {
    const db = firebase.getDatabase();
    expect(db).toBeDefined();
    expect(admin.firestore).toHaveBeenCalled();
  });

  test("getAuth should return an Auth instance", () => {
    const auth = firebase.getAuth();
    expect(auth).toBeDefined();
    expect(admin.auth).toHaveBeenCalled();
  });

  test("Firebase should not initialize more than once", () => {
    firebase.getDatabase();
    firebase.getAuth();
    expect(admin.initializeApp).toHaveBeenCalledTimes(1); // Firebase should initialize only once
  });
});
