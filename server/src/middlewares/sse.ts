import { connectionsEventBus } from "../services/eventBus";
import { AuthMiddleware } from "../types/auth";
import { createEventData } from "../utils/stream";

/**
 * Initializes the SSE connection.
 */
const initialize: AuthMiddleware = (_, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const id = Date.now().toString() + "." + Math.floor(Math.random() * 10000).toString().padStart(4, "0");

  res.write(`data: ${JSON.stringify({ sseId: id })}\n\n`);

  connectionsEventBus.on(id, () => {
    connectionsEventBus.offAll(id);
    res.write(`data: ${JSON.stringify({ cleanup: true })}\n\n`)
    res.write(`event: CLOSE\ndata: ${createEventData("USER STOP", {})}\n\n`);
    res.end();
  });

  res.locals.sse = {
    id,
    initialized: true,
    finalized: false,
  };

  next();
};

const stop: AuthMiddleware = (req, res, next) => {
  const id = req.params.sseId;

  connectionsEventBus.emit(id);
  next();
}

/**
 * Finalizes the SSE connection.
 */
const finalize: AuthMiddleware = (_, res, next) => {

  connectionsEventBus.offAll(res.locals.sse.id);

  res.write(`data: ${JSON.stringify({ cleanup: true })}\n\n`)
  res.end();

  res.locals.sse.initialized = false;
  res.locals.sse.finalized = true;

  next();
};

export default {
  initialize,
  stop,
  finalize,
};