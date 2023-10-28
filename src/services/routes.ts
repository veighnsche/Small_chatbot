import express from "express";
import chatRouter from "../api/chat";

export const setupRoutes = (app: express.Application) => {
  // Chat routes
  app.use("/chat", chatRouter);
};