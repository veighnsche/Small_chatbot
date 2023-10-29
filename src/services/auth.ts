import admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/lib/auth";
import { AuthMiddleware } from "../types/auth";
import { ENVIRONMENT } from "./environmentVariables";

export const authenticateRequest: AuthMiddleware = async (req, res, next) => {
  if (ENVIRONMENT === "development") {
    req.user = { uid: "test_user_2" } as DecodedIdToken;
    return next();
  }

  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    console.error("Someone tried to access a protected route without a token.")
    return res.status(401).send("Authentication required.");
  }

  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    console.error("Someone tried to access a protected route with an invalid token.")
    res.status(401).send("Invalid token.");
  }
};