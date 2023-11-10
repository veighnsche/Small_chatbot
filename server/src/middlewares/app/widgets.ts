import express, { Application } from "express";
import * as path from "path";

export function setupWidgets(app: Application) {
  app.use(express.static(path.join(__dirname, "../../../../widgets/chat/dist")));
}