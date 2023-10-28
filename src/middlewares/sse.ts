import { AuthMiddleware } from "../types/auth";

/**
 * Initializes the SSE connection.
 */
const initialize: AuthMiddleware = (_, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.locals.sse = {
    initialized: true,
    finalized: false,
  };

  next();
};

/**
 * Finalizes the SSE connection.
 */
const finalize: AuthMiddleware = (_, res, next) => {
  res.end();

  res.locals.sse.initialized = false;
  res.locals.sse.finalized = true;

  next();
};

export default {
  initialize,
  finalize,
};