import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "../services/environmentVariables";
import { authenticateRequest } from "../services/auth";
import { errorHandler } from "./error";
import { getRateLimiter } from "../services/rateLimiter";

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: "GET,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export function setupAppMiddlewares(app: express.Application) {
  app.use(errorHandler);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(getRateLimiter());
  app.use(authenticateRequest);
}
