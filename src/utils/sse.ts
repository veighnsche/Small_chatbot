import { Response } from "express";
import { AuthRequest } from "../types/auth";

export function setupSSE(req: AuthRequest, res: Response, next: any) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with the client

  next();
}
