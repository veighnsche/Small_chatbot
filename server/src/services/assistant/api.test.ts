import { OpenAI } from "openai";
import fetchMock from "jest-fetch-mock";
import { AssistantApi } from "./api";

jest.mock("openai", () => ({
	OpenAI: jest.fn().mockImplementation(() => ({
		chat: {
			completions: {
				create: jest.fn(),
			},
		},
	})),
}));

fetchMock.enableMocks();

describe("AssistantApi", () => {
	const OPENAI_KEY = "test-openai-key";
	const IO_AZURE_OPENAI_KEY = "test-ioazure-key";
	const IO_AZURE_OPENAI_ENDPOINT = "http://test.endpoint";

	beforeAll(() => {
		process.env.OPENAI_KEY = OPENAI_KEY;
		process.env.IO_AZURE_OPENAI_KEY = IO_AZURE_OPENAI_KEY;
		process.env.IO_AZURE_OPENAI_ENDPOINT = IO_AZURE_OPENAI_ENDPOINT;
	});

	beforeEach(() => {
		fetchMock.resetMocks();
		jest.clearAllMocks();
	});

	it("should initialize with OpenAI key", () => {
		const api = new AssistantApi({ openaiKey: OPENAI_KEY });
		expect(api).toBeDefined();
		expect(OpenAI).toHaveBeenCalledWith({ apiKey: OPENAI_KEY });
	});

	it("should initialize with IO Azure key", () => {
		const api = new AssistantApi({ iOazureKey: IO_AZURE_OPENAI_KEY });
		expect(api).toBeDefined();
		// Additional checks for the fetch call can be added here
	});

	it("should throw error when no keys are provided", () => {
		expect(() => new AssistantApi({})).toThrow("Must have either OPENAI_KEY or IO_AZURE_OPENAI_KEY set.");
	});

	it("should throw error when both keys are provided", () => {
		expect(() => new AssistantApi({ openaiKey: OPENAI_KEY, iOazureKey: IO_AZURE_OPENAI_KEY })).toThrow("Cannot have both OPENAI_KEY and IO_AZURE_OPENAI_KEY set.");
	});

	// Additional tests for chatCompletion and chatCompletionStream can be added here

});

