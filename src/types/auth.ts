import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { DecodedIdToken } from "firebase-admin/lib/auth";

export interface AuthRequest<T = any> extends Request<ParamsDictionary, any, T> {
  user?: DecodedIdToken;
}

export interface AuthResponse<T extends Record<string, any> = Record<string, any>> extends Response<any, T> {}

export type AuthMiddleware<T = any, R extends Record<string, any> = Record<string, any>> = (req: AuthRequest<T>, res: AuthResponse<R>, next: NextFunction) => void;