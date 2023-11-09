import { FIREBASE_CONFIG } from "../services/environmentVariables";
import { AuthMiddleware } from "../types/auth";
import { encodeMessage } from "../utils/crypto";

const sendEncodedConfig: AuthMiddleware = async (req, res) => {
  const encodedConfig = encodeMessage(req.user.uid, FIREBASE_CONFIG);
  res.status(200).send(encodedConfig);
};

export default {
  sendEncodedConfig,
};