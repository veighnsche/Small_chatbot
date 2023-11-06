import { AuthMiddleware } from "../types/auth";
import asserts from "./asserts";
import assistant from "./assistant";
import chat from "./chat";
import error from "./error";
import firebaseAuth from "./firebaseAuth";
import firebaseRepositories from "./firebaseRepositories";
import log from "./logging";
import messages from "./messages";
import sse from "./sse";

export default {
  auth: {
    firebase: firebaseAuth,
  },
  asserts,
  try: error,
  log,
  messages,
  repositories: {
    firestore: firebaseRepositories,
  },
  sse,
  chat,
  assistant,
  200: (data: any) => <AuthMiddleware>((_, res) => res.status(200).send(data)),
  204: <AuthMiddleware>((_, res) => res.status(204).send()),
};