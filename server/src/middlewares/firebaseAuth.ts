import { DecodedIdToken } from "firebase-admin/lib/auth";
import { ENVIRONMENT } from "../services/environmentVariables";
import { getAuth } from "../services/firebase";
import { LlamaMiddleware } from "../types/api/middleware";

/**
 * Authenticate a request using a Firebase ID token.
 * Then, add the user to the request.
 */
const authenticateRequest: LlamaMiddleware = async (req, res, next) => {
	const token = req.headers.authorization?.split("Bearer ")[1];

	if (!token) {
		if (ENVIRONMENT === "development") {
			req.user = { uid: "test_user_2" } as DecodedIdToken;
			return next();
		}
		console.trace("Someone tried to access a protected route without a token.");
		return res.status(401).send("Authentication required.");
	}

	try {
		/**
     * Verify the token and add the user to the request.
     */
		req.user = await getAuth().verifyIdToken(token);
		next();
	} catch (error) {
		console.log(token);
		console.trace("Someone tried to access a protected route with an invalid token.");
		return res.status(401).send("Invalid token.");
	}
};

export default {
	protect: authenticateRequest,
};