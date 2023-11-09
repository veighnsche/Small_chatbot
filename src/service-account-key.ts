import { config } from "dotenv";

config();

export const serviceAccountKey = {
  type: process.env.SERVICE_ACCOUNT_TYPE,
  projectId: process.env.PROJECT_ID,
  privateKeyId: process.env.PRIVATE_KEY_ID,
  // Note: The private key new lines need to be replaced with actual new line characters if they're stored in .env with escaped new lines
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.CLIENT_EMAIL,
  clientId: process.env.CLIENT_ID,
  authUri: process.env.AUTH_URI,
  tokenUri: process.env.TOKEN_URI,
  authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
  universeDomain: process.env.UNIVERSE_DOMAIN,
};
