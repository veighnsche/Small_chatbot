import { jsonrepair } from "jsonrepair";
import { ILlamaMessage } from "../types/chat";

export function getLastId(messages: ILlamaMessage[]): string {
	if (messages.length === 0) return "-1";
	return messages[messages.length - 1].id;
}

export function makeArgs(args: string): any {
	try {
		return JSON.parse(args);
	} catch (err) {
		// console.error("makeArgs: could not parse args as JSON");
		// commented out because this is expected behavior, backend needs to fix this.
		// the args always starts with "undefined"
	}

	if (!args.startsWith("{")) {
		// remove all the text before the first {
		const firstBraceIndex = args.indexOf("{");
		const newArgs = args.substring(firstBraceIndex);
		try {
			return JSON.parse(newArgs);
		} catch (err) {
			console.error("makeArgs: could not parse args by removing text before first {");
		}
	}

	try {
		const json = jsonrepair(args);
		if (json) {
			return json;
		}
	} catch (err) {
		console.error("makeArgs: could not fix JSON");
	}

	console.log(args);

	throw new Error("Argument could not be parsed as JSON, do you need more tokens?");
}