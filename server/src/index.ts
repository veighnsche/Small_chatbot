import express from "express";
import "reflect-metadata";
import { setupAppMiddlewares } from "./middlewares/app";
import { setupWidgets } from "./middlewares/app/widgets";
import { HOST, PORT } from "./services/environmentVariables";
import { setupRoutes } from "./services/routes";

const port = typeof PORT === "string" ?
  parseInt(PORT, 10) :
  PORT;

const host = HOST;

const app = express();

setupAppMiddlewares(app);

setupWidgets(app);

setupRoutes(app);

app.listen(port, host, () => {
  console.log(`iO Assistant server is running on http://${host}:${port}`);
});