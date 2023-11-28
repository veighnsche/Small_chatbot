import { v4 as uuid } from "uuid";

export const generateUniqueID = () => {
	// current timestamp in milliseconds + dot + 4 random digits
	return uuid();
};