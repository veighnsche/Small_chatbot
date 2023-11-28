import { RequestHandler, Router } from "express";
import mw from "../middlewares";

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