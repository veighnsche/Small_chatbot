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
            console.trace(`${name}: req.params.sse_id: Required.`)
            next(new Error(`${name}: req.params.sse_id: Required.`));
          }
          break;

        case "chat_id":
          if (!req.params.chat_id) {
            console.trace(`${name}: req.params.chat_id: Required.`)
            next(new Error(`${name}: req.params.chat_id: Required.`));
          }
          break;

        case "clientMessages":
          try {
            assertArray(req.body.clientMessages);
          } catch (err) {
            console.trace(`${name}: req.body.clientMessages: ${(err as Error).message}`)
            next(new Error(`${name}: req.body.clientMessages: ${(err as Error).message}`));
          }

          for (const message of req.body.clientMessages) {
            try {
              assertChatCompletionMessage(message);
            } catch (err) {
              console.trace(`${name}: req.body.clientMessages: ${(err as Error).message}`)
              next(new Error(`${name}: req.body.clientMessages: ${(err as Error).message}`));
            }
          }
          break;

        case "assistantParams":
          try {
            assertModel(req.body.assistantParams.model);
          } catch (err) {
            console.trace(`${name}: req.body.assistantParams.model: ${(err as Error).message}`)
            next(new Error(`${name}: req.body.assistantParams.model: ${(err as Error).message}`));
          }
          break;

        case "assistant_id":
          if (!req.body.assistant_uid) {
            console.trace(`${name}: req.body.assistant_uid: Required.`)
            next(new Error(`${name}: req.body.assistant_uid: Required.`));
          }
          break;

        case "title":
          if (!req.body.title) {
            console.trace(`${name}: req.body.title: Required.`)
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
              console.trace(`${name}: User UID has not been found to initialize chat col`)
              next(new Error(`${name}: User UID has not been found to initialize chat col`));
            }

            res.locals.chatColRepo = new ChatCollectionRepository(userUid);
          }
          break;

        case "chatDocRepo":
          if (!res.locals.chatDocRepo) {
            const user_id = req.user?.uid;
            const chat_id = res.locals.chat_id || req.params.chat_id;

            if (!user_id) {
              console.trace(`${name}: User_id has not been found to initialize chat doc`)
              next(new Error(`${name}: User_id has not been found to initialize chat doc`));
            }

            if (!chat_id) {
              console.trace(`${name}: Chat_id has not been found to initialize chat doc`)
              next(new Error(`${name}: Chat_id has not been found to initialize chat doc`));
            }

            res.locals.chatDocRepo = new ChatDocumentRepository(user_id, chat_id);
          }
          break;

        case "sse":
          if (!res.locals.sse) {
            console.trace(`${name}: SSE has not been initialized`)
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
        console.trace(err);
        next(err);
      }
    };
  };
}