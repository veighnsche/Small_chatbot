import { NextFunction, RequestHandler, Router } from "express";
import mw from "../middlewares";
import { LlamaReq, LlamaRes } from "../types/api/middleware";

export interface LlamaHandlerParams extends Record<string, any> {
  req: LlamaReq;
  res: LlamaRes;
  next: NextFunction;
}

interface CustomRouter extends Router {
  postSse: (path: string, ...handlers: RequestHandler[]) => void;
}

const expressRouter: CustomRouter = Router() as CustomRouter;

expressRouter.postSse = (path, ...handlers) => {
  expressRouter.post(path,
    mw.sse.initialize,
    ...handlers,
    mw.sse.finalize,
  );
};

export const llamaRouter = () => expressRouter;