import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { DecodedIdToken } from "firebase-admin/lib/auth";

export interface LlamaReq<Body = any> extends Request<ParamsDictionary, any, Body> {
  user?: DecodedIdToken;
}

export interface LlamaReqP<Params extends ParamsDictionary, Body = any> extends Request<Params, any, Body> {
  user?: DecodedIdToken;
}

export interface LlamaRes<Locals extends Record<string, any> = Record<string, any>> extends Response<any, Locals> {}

export type LlamaMiddleware<Body = any, Locals extends Record<string, any> = Record<string, any>> = (req: LlamaReq<Body>, res: LlamaRes<Locals>, next: NextFunction) => void;