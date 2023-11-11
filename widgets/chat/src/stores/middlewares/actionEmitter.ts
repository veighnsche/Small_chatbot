import { llamaEventBus } from "../../services/llamaEventBus.ts";
import { LlamaMiddleware } from "../llamaStore.ts";

export const actionEmitterMiddleware: LlamaMiddleware = () => next => action => {
  llamaEventBus.emit("llama-action", action);
  return next(action);
};