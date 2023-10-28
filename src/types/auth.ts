import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { DecodedIdToken } from "firebase-admin/lib/auth";

export interface AuthRequest<T = any> extends Request<ParamsDictionary, any, T> {
  user?: DecodedIdToken;
}

export type AuthMiddleware<T = any> = (req: AuthRequest<T>, res: Response, next: NextFunction) => void;