import { ChatCompletionChunk } from "openai/resources/chat";
import { DeltaCombiner } from "./delta";

describe('DeltaCombiner', () => {
  let deltaCombiner: DeltaCombiner;

  beforeEach(() => {
    deltaCombiner = new DeltaCombiner();
  });

  test('should combine multiple content deltas into one message', () => {
    const deltas: ChatCompletionChunk.Choice.Delta[] = [
      { content: "Hello, " },
      { content: "how " },
      { content: "are " },
      { content: "you?" }
    ];

    deltas.forEach(delta => deltaCombiner.appendDelta(delta));

    expect(deltaCombiner.assistantMessage).toEqual({
      content: deltas.reduce((acc, delta) => acc + delta.content, ""),
    });
  });

  test('should set the role of the assistant message', () => {
    deltaCombiner.appendDelta({ role: 'user' });
    expect(deltaCombiner.assistantMessage.role).toBe('user');
  });

  test('should set and append function_call arguments', () => {
    deltaCombiner.appendDelta({ function_call: { name: "getDate", arguments: "" } });
    deltaCombiner.appendDelta({ function_call: { arguments: "2021-09-" } });
    deltaCombiner.appendDelta({ function_call: { arguments: "01" } });

    expect(deltaCombiner.assistantMessage.function_call).toEqual({
      name: 'getDate',
      arguments: '2021-09-01'
    });
  });

  test('should handle mixed types of deltas', () => {
    deltaCombiner.appendDelta({ role: 'system' });
    deltaCombiner.appendDelta({ content: "Goodbye, " });
    deltaCombiner.appendDelta({ function_call: { name: "getTime", arguments: "10:" } });
    deltaCombiner.appendDelta({ function_call: { arguments: "00 AM" } });
    deltaCombiner.appendDelta({ content: "see you soon." });

    expect(deltaCombiner.assistantMessage).toEqual({
      role: 'system',
      content: "Goodbye, see you soon.",
      function_call: {
        name: 'getTime',
        arguments: '10:00 AM'
      }
    });
  });

  test('should ignore delta without recognized keys', () => {
    deltaCombiner.appendDelta({} as ChatCompletionChunk.Choice.Delta);
    deltaCombiner.appendDelta({ content: "Ignored?"});
    expect(deltaCombiner.assistantMessage).toEqual({ content: "Ignored?" });
  });

  test('should support deltas with only a role', () => {
    deltaCombiner.appendDelta({ role: 'assistant' });
    expect(deltaCombiner.assistantMessage.role).toBe('assistant');
  });

  test('should retain role between deltas when not provided again', () => {
    deltaCombiner.appendDelta({ role: 'assistant' });
    deltaCombiner.appendDelta({ content: "Hello" });

    expect(deltaCombiner.assistantMessage).toEqual({
      role: 'assistant',
      content: 'Hello'
    });
  });

  test('should reset correctly', () => {
    deltaCombiner.appendDelta({ role: 'assistant' });
    deltaCombiner.appendDelta({ content: "Hello" });
    deltaCombiner.appendDelta({ function_call: { name: "getWeather", arguments: "{}"} });
    deltaCombiner = new DeltaCombiner(); // Reset

    expect(deltaCombiner.assistantMessage).toEqual({
      content: ""
    });
  });

});