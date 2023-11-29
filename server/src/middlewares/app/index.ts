import cors from "cors";
import express, { type Application } from "express";
import { CORS_ORIGIN } from "../../services/environmentVariables";
import { getRateLimiter } from "../../services/rateLimiter";

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: "GET,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export function setupAppMiddlewares(app: Application) {
  app.use(express.json());

  app.use(cors(corsOptions));
  app.use(getRateLimiter());
}
