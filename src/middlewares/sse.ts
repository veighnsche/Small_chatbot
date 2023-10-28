import { AuthMiddleware } from "../types/auth";

const initialize: AuthMiddleware = (_, res, next) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.locals.see.initialized = true;

  next();
};

const finalize: AuthMiddleware = (_, res, next) => {
  res.end();

  res.locals.see.initialized = false;

  next();
};

export default {
  initialize,
  finalize,
};