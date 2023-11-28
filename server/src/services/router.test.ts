import mw from "../middlewares";
import { llamaRouter } from "./router";

jest.mock("express", () => {
  return {
    Router: jest.fn(() => ({
      post: jest.fn(),
    })),
  };
});

jest.mock("../middlewares", () => ({
  sse: {
    initialize: jest.fn(),
    finalize: jest.fn(),
  },
}));

describe("Llama Router", () => {
  test("llamaRouter should return a router instance", () => {
    const router = llamaRouter();
    expect(typeof router).toBe("object"); // Router is an object
    expect(router).toHaveProperty("postSse");
  });

  test("postSse should set up a POST route with specific middleware", () => {
    const router = llamaRouter();
    const path = "/test";
    const handler = jest.fn();

    router.postSse(path, handler);

    expect(router.post).toHaveBeenCalledWith(
      path,
      mw.sse.initialize,
      handler,
      mw.sse.finalize,
    );
  });
});
