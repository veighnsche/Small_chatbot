import express from "express";
import { setupAppMiddlewares } from "./middlewares/app";
import { setupWidgets } from "./middlewares/app/widgets";
import { PORT } from "./services/environmentVariables";
import { initializeFirebase } from "./services/firebase";
import { setupRoutes } from "./services/routes";

const port = PORT;

const app = express();

initializeFirebase();

setupAppMiddlewares(app);

setupWidgets(app);

setupRoutes(app);

app.listen(port, () => {
  console.log(`iO Assistant server is running on http://localhost:${port}`);
});