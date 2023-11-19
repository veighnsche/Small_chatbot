import { NextFunction, Request, Response } from "express";
import { connectionsEventBus } from "../services/eventBus";
import { AuthMiddleware } from "../types/auth";

/**
 * Handles errors by sending a 500 response.
 */
export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  console.trace({ 'error in errorHandler in the middlewares:': err.message });

  if (res.locals.sse.initialized) {
    connectionsEventBus.offAll(res.locals.sse.id);
    res.write(`event: ERROR\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
    res.write(`data: ${JSON.stringify({ cleanup: true })}\n\n`)
    return res.end();
  } else if (res.headersSent) {
    return next(err);
  } else {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Wraps an async function in a try/catch block.
 */
export default (fn: AuthMiddleware) => (req: Request, res: Response, next: NextFunction) => {
  try {
    fn(req, res, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
};