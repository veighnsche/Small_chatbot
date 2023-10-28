import express from "express";
import { PORT } from "./services/environmentVariables";
import { initializeFirebase } from "./services/firebase";
import { setupMiddlewares } from "./services/middlewares";
import { setupRoutes } from "./services/routes";

const port = PORT;

const app = express();

initializeFirebase();

setupMiddlewares(app);

setupRoutes(app);

app.listen(port, () => {
  console.log(`iO Assistant server is running on http://localhost:${port}`);
});