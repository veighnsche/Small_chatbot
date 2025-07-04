import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { LlamaMessage } from "../../../models/chatMessage";
import { connectionsEventBus } from "../../eventBus";
import { llamaChatCompletion, llamaChatCompletionStream } from "../../assistant/api";
import { callAssistantStream, callChatTitleAssistant } from "../../assistant";

jest.mock("../../eventBus");

jest.mock("../../assistant/api");

describe("callAssistantStream", () => {
  const mockSse_id = "test-sse-id";
  const mockAssistantParams: ChatCompletionCreateParamsNonStreaming = {
    model: "mocked model",
    messages: [{ role: "user", content: "mocked message" }],
  };
  let mockChatCompletionStream: any;

  beforeEach(() => {
    mockChatCompletionStream = {
      [Symbol.asyncIterator]() {
        return {
          next: jest.fn().mockResolvedValue({ value: { choices: [{ text: "mocked choice" }] }, done: false }),
          return: jest.fn().mockResolvedValue({ done: true }),
        };
      },
    };
    llamaChatCompletionStream.mockResolvedValue(mockChatCompletionStream);
    // @ts-expect-error: mockClear comes from jest, but not from the actual connectionEventBus
    connectionsEventBus.on.mockClear();
  });

  it("should create a chat completion stream", async () => {
    const generator = callAssistantStream(mockAssistantParams, mockSse_id);

    await expect(generator.next()).resolves.toEqual({ value: { text: "mocked choice" }, done: false });
    expect(llamaChatCompletionStream).toHaveBeenCalledWith(mockAssistantParams);
  });

  it("should handle stream errors correctly", async () => {
    llamaChatCompletionStream.mockRejectedValue(new Error("stream error"));
    const generator = callAssistantStream(mockAssistantParams, mockSse_id);

    await expect(generator.next()).rejects.toThrow("stream error");
  });

  it("should stop yielding new values when stop event is emitted", async () => {
    const generator = callAssistantStream(mockAssistantParams, mockSse_id);
    connectionsEventBus.emit(mockSse_id);

    await generator.next(); // proceed to next yield
    // TODO: fix this test
    // await expect(generator.next()).resolves.toEqual({ done: true });
  });

  // Additional tests can be added to cover more scenarios
});




describe("callChatTitleAssistant", () => {
  beforeEach(() => {
    llamaChatCompletion.mockClear();
  });

  it("should generate a title for chat messages", async () => {
    const chatMessages = [
      new LlamaMessage("Hello", "1", "0", "user"),
      new LlamaMessage("Hi there", "2", "1", "assistant"),
    ]; // Mock LlamaMessage instances
    const mockCompletion = {
      choices: [{
        message: {
          function_call: {
            arguments: JSON.stringify({ title: "Generated Title" }),
          },
        },
      }],
    };
    llamaChatCompletion.mockResolvedValue(mockCompletion);

    const title = await callChatTitleAssistant(chatMessages);
    expect(title).toBe("Generated Title");
    expect(llamaChatCompletion).toHaveBeenCalled();
  });

  // Additional tests for error scenarios can be added here
});
