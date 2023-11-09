import { NextFunction, Request, Response } from "express";
import { AuthMiddleware } from "../types/auth";

/**
 * Handles errors by sending a 500 response.
 */
export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  console.error(err.message);

  if (res.locals.sse.initialized) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
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