import express from "express";
import chatRouter from "../api/chat";
import pingRouter from "../api/ping";
import stateRouter from "../api/state";
import { errorHandler } from "../middlewares/error";


// const specs = swaggerJsDoc(swaggerOptions);

export const setupRoutes = (app: express.Application) => {
  // Swagger UI
  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

  // Chat routes
  app.use("/api/v1/chat", chatRouter);

  // State routes
  app.use("/api/v1/state", stateRouter);

  // Dev routes
  app.use("/api/v1/ping", pingRouter);

  app.use(errorHandler);
};