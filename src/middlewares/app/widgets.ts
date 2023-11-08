import express, { Application } from "express";
import * as path from "path";

export function setupWidgets(app: Application) {
  app.use(express.static(path.join(__dirname, "../../../widgets/chat/build")));

  app.get("/widgets/v1/chat", (req, res) => {

  });

  app.get("/playground", (req, res) => {
    const fullUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    console.log(`Full URL: ${fullUrl}`);

    console.log({
      __dirname,
      __filename,
      "req.path": req.path,
      "req.originalUrl": req.originalUrl,
      "req.baseUrl": req.baseUrl,
      "req.url": req.url,

    });

    res.sendFile(path.join(__dirname, "../../../widgets/chat", "sandbox.html"));
  });
}