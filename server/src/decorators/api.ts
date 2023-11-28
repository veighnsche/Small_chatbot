import { assertArray } from "../asserts/array";
import { assertModel } from "../asserts/assistant";
import { assertChatCompletionMessage } from "../asserts/message";
import { LlamaMessage } from "../models/chatMessage";
import { ChatCollectionRepository } from "../repositories/firebase/chatCol";
import { ChatDocumentRepository } from "../repositories/firebase/chatDoc";
import { LlamaMiddleware } from "../types/api/middleware";

type propsAuth = "user_id";
type propsParams = "sse_id" | "chat_id";
type propsBody = "clientMessages" | "assistantParams" | "title" | "assistant_id";
type propsLocals = "thread" | "chatColRepo" | "chatDocRepo" | "sse";

export function LlamaAsserts(...asserts: (propsAuth | propsParams | propsBody | propsLocals)[]) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const name = `${target.constructor.name} ${propertyKey}`;
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: Parameters<LlamaMiddleware>) {
			const [req, res, next] = args;

			// Check if all required props are present
			for await (const prop of asserts) {
				switch (prop) {
				case "sse_id":
					if (!req.params.sse_id) {
						next(new Error(`${name}: req.params.sseId: Required.`));
					}
					break;

				case "chat_id":
					if (!req.params.chatId) {
						next(new Error(`${name}: req.params.chatId: Required.`));
					}
					break;

				case "clientMessages":
					try {
						assertArray(req.body.clientMessages);
					} catch (err) {
						next(new Error(`${name}: req.body.clientMessages: ${(err as Error).message}`));
					}

					for (const message of req.body.clientMessages) {
						try {
							assertChatCompletionMessage(message);
						} catch (err) {
							next(new Error(`${name}: req.body.clientMessages: ${(err as Error).message}`));
						}
					}
					break;

				case "assistantParams":
					try {
						assertModel(req.body.assistantParams.model);
					} catch (err) {
						next(new Error(`${name}: req.body.assistantParams.model: ${(err as Error).message}`));
					}
					break;

				case "assistant_id":
					if (!req.body.assistant_uid) {
						next(new Error(`${name}: req.body.assistant_uid: Required.`));
					}
					break;

				case "title":
					if (!req.body.title) {
						next(new Error(`${name}: req.body.title: Required.`));
					}
					break;

				case "thread":
					if (!res.locals.thread) {
						const messages = req.body.thread || [];
						res.locals.thread = LlamaMessage.fromRecords(messages);
					}
					break;

				case "chatColRepo":
					if (!res.locals.chatColRepo) {
						const userUid = req.user?.uid;

						if (!userUid) {
							next(new Error(`${name}: User UID has not been found to initialize chat col`));
						}

						res.locals.chatColRepo = new ChatCollectionRepository(userUid);
					}
					break;

				case "chatDocRepo":
					if (!res.locals.chatDocRepo) {
						const userUid = req.user?.uid;
						const chatId = res.locals.chatId || req.params.chatId;

						if (!userUid) {
							next(new Error(`${name}: User UID has not been found to initialize chat doc`));
						}

						if (!chatId) {
							next(new Error(`${name}: Chat ID has not been found to initialize chat doc`));
						}

						res.locals.chatDocRepo = new ChatDocumentRepository(userUid, chatId);
					}
					break;

				case "sse":
					if (!res.locals.sse) {
						next(new Error(`${name}: SSE has not been initialized`));
					}
					break;

				default:
					break;
				}
			}

			try {
				// Call the original method, ensuring 'this' context is preserved
				await originalMethod.apply(this, args);
				next();
			} catch (err) {
				next(err);
			}
		};
	};
}