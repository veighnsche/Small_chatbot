import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { DecodedIdToken } from "firebase-admin/lib/auth";

export interface ReqBody<Body = any> extends Request<ParamsDictionary, any, Body> {
  user?: DecodedIdToken;
}

export interface ResLocals<Locals extends Record<string, any> = Record<string, any>> extends Response<any, Locals> {}

export type AuthMiddleware<Body = any, Locals extends Record<string, any> = Record<string, any>> = (req: ReqBody<Body>, res: ResLocals<Locals>, next: NextFunction) => void;