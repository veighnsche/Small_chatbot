import express from "express";
import chatRouter from "../api/chat";
import pingRouter from "../api/ping";
import { errorHandler } from "../middlewares/error";
import { setupRoutes } from "./routes";

jest.mock("../api/chat", () => jest.fn());
jest.mock("../api/ping", () => jest.fn());
jest.mock("../middlewares/error", () => ({ errorHandler: jest.fn() }));

describe("setupRoutes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use = jest.fn();
  });

  it("should setup chat routes", () => {
    setupRoutes(app);
    expect(app.use).toHaveBeenCalledWith("/api/v1/chat", chatRouter);
  });

  it("should setup ping routes", () => {
    setupRoutes(app);
    expect(app.use).toHaveBeenCalledWith("/api/v1/ping", pingRouter);
  });

  it("should use errorHandler middleware", () => {
    setupRoutes(app);
    expect(app.use).toHaveBeenCalledWith(errorHandler);
  });

  // Additional tests can be written here to cover more scenarios
});
