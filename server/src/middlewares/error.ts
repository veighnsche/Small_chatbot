import { NextFunction, Request, Response } from "express";
import { connectionsEventBus } from "../services/eventBus";

/**
 * Handles errors by sending a 500 response.
 */
export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    console.trace("Error after headers sent:", err);
    return next(err);
  } else if (res.locals.sse.initialized) {
    connectionsEventBus.offAll(res.locals.sse.id);
    res.write(`event: ERROR\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
    res.write(`data: ${JSON.stringify({ cleanup: true })}\n\n`);
    return res.end();
  } else {
    return res.status(500).json({ error: err.message });
  }
};