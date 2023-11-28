import { config } from "dotenv";

config();

export const HOST = process.env.LLAMA_TREE_HOST;
export const PORT = process.env.LLAMA_TREE_PORT;
export const CORS_ORIGIN = process.env.LLAMA_TREE_CORS_ORIGIN;
export const ENVIRONMENT = process.env.LLAMA_TREE_ENVIRONMENT;
export const OPENAI_KEY = process.env.LLAMA_TREE_OPENAI_KEY;
export const IO_AZURE_OPENAI_ENDPOINT = process.env.LLAMA_TREE_AZURE_OPENAI_ENDPOINT;
export const IO_AZURE_OPENAI_KEY = process.env.LLAMA_TREE_AZURE_OPENAI_KEY;

export const FIREBASE_CONFIG = {
	apiKey: process.env.FB_CONF_APIKEY,
	authDomain: process.env.FB_CONF_AUTHDOMAIN,
	databaseURL: process.env.DFB_CONF_ATABASEURL,
	projectId: process.env.FB_CONF_PROJECTID,
	storageBucket: process.env.FB_CONF_STORAGEBUCKET,
	messagingSenderId: process.env.FB_CONF_MESSAGINGSENDERID,
	appId: process.env.FB_CONF_APPID,
	measurementId: process.env.FB_CONF_MEASUREMENTID,
};

export const SERVICE_ACCOUNT_KEY = {
	type: process.env.FB_SAK_SERVICE_ACCOUNT_TYPE,
	projectId: process.env.FB_SAK_PROJECT_ID,
	privateKeyId: process.env.FB_SAK_PRIVATE_KEY_ID,
	// Note: The private key new lines need to be replaced with actual new line characters if they're stored in .env with escaped new lines
	privateKey: process.env.FB_SAK_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	clientEmail: process.env.FB_SAK_CLIENT_EMAIL,
	clientId: process.env.FB_SAK_CLIENT_ID,
	authUri: process.env.FB_SAK_AUTH_URI,
	tokenUri: process.env.FB_SAK_TOKEN_URI,
	authProviderX509CertUrl: process.env.FB_SAK_AUTH_PROVIDER_X509_CERT_URL,
	clientX509CertUrl: process.env.FB_SAK_CLIENT_X509_CERT_URL,
	universeDomain: process.env.FB_SAK_UNIVERSE_DOMAIN,
};