import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "../constants";
import { authenticateRequest } from "./auth";
import { getRateLimiter } from "./rateLimiter";

// import { authenticateRequest } from './auth';

export function setupMiddlewares(app: express.Application) {
  // CORS setup
  const corsOptions = {
    origin: CORS_ORIGIN,
    methods: "GET,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Body parser setup
  app.use(express.json());

  // Rate limiter setup
  app.use(getRateLimiter());

  // Authentication setup
  app.use(authenticateRequest);
}
