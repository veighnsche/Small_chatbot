import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  console.trace(err);
  if (res.headersSent) {
    return next(err);
  }
  if (res.locals.sse.initialized) {
    res.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);
    res.end();
  } else {
    res.status(500).json({ error: err.message });
  }
};

export default (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res, next).catch(next);
};