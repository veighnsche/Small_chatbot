import cors from "cors";
import express, { type Application } from "express";
import * as path from "path";
import { CORS_ORIGIN } from "../services/environmentVariables";
import { getRateLimiter } from "../services/rateLimiter";

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: "GET,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export function setupAppMiddlewares(app: Application) {
  app.use(cors(corsOptions));

  app.use(express.static(path.join(__dirname, "../public")));

  app.use(express.static(path.join(__dirname, "../../widgets/chat/build")));
  app.get("/widgets/v1/chat", (req, res) => {
    res.sendFile(path.join(__dirname, "../../widgets/chat", "sandbox.html"));
  });

  app.use(express.json());
  app.use(getRateLimiter());
}
