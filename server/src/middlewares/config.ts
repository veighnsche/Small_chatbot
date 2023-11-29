import { FIREBASE_CONFIG } from "../services/environmentVariables";
import { LlamaMiddleware } from "../types/api/middleware";
import { encodeMessage } from "../utils/crypto";

const sendEncodedConfig: LlamaMiddleware = async (req, res) => {
  const encodedConfig = encodeMessage(req.user.uid, FIREBASE_CONFIG);
  res.status(200).send(encodedConfig);
};

export default {
  sendEncodedConfig,
};