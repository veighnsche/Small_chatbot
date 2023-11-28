import { NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { LlamaReq, LlamaRes } from "../types/api/middleware";
import { getRateLimiter } from "./rateLimiter"; // Adjust the import path as necessary

jest.mock("express-rate-limit", () => {
	return jest.fn(() => (req: LlamaReq, res: LlamaRes, next: NextFunction) => next()); // Mock implementation returns a dummy middleware function
});

describe("Rate Limiter", () => {
	test("should configure rate limiter with correct settings", () => {
		getRateLimiter();

		expect(rateLimit).toHaveBeenCalledWith({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // limit each IP to 100 requests per windowMs
		});
	});

	test("should return a middleware function", () => {
		const rateLimiterMiddleware = getRateLimiter();
		expect(typeof rateLimiterMiddleware).toBe("function");
	});
});
