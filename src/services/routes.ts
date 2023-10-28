import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import chatRouter from "../api/chat";
import { errorHandler } from "../middlewares/error";
import swaggerOptions from "../swaggerOptions";


const specs = swaggerJsDoc(swaggerOptions);

export const setupRoutes = (app: express.Application) => {
  // Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

  // Chat routes
  app.use("/api/v1/chat", chatRouter);

  app.use(errorHandler);
};