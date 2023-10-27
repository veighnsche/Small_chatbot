import admin from "firebase-admin";
import { AuthMiddleware } from "../types/auth";

export const authenticateRequest: AuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  // console.log(req.path, "Token:", token);
  if (!token) {
    return res.status(401).send("Authentication required.");
  }

  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    res.status(401).send("Invalid token.");
  }
};