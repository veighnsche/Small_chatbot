import { jsonrepair } from "jsonrepair";
import { ILlamaMessage } from "../types/chat";
import { getLastId, makeArgs } from "./messages";

jest.mock("jsonrepair", () => {
  return {
    jsonrepair: jest.fn(),
  };
});

describe("getLastId", () => {
  test("should return -1 when messages is empty", () => {
    expect(getLastId([])).toBe("-1");
  });

  test("should return the id of the last message in the list", () => {
    const messages: ILlamaMessage[] = [
      { id: "1", content: "First", role: "user", parent_id: "-1" },
      { id: "99", content: "Last", role: "user", parent_id: "1" },
    ];
    expect(getLastId(messages)).toBe("99");
  });
});

describe("makeArgs", () => {
  const validJSON = "{\"key\":\"value\"}";
  const invalidJSON = "undefined{key:\"value\"}";
  const repairedJSON = "{\"key\":\"value\"}";

  test("should parse valid JSON string", () => {
    expect(makeArgs(validJSON)).toEqual({ key: "value" });
  });

  test("should throw error when unable to parse non-JSON", () => {
    expect(() => {
      makeArgs("Not a JSON string");
    }).toThrow();
  });

  test("should call jsonrepair on invalid JSON and successfully parse", () => {
    (jsonrepair as jest.Mock).mockImplementationOnce(() => repairedJSON);
    expect(makeArgs(invalidJSON)).toEqual("{\"key\":\"value\"}");
    expect(jsonrepair).toHaveBeenCalledWith(invalidJSON);
  });

  test("should log original args and throw error when jsonrepair is unsuccessful", () => {
    // Mock jsonrepair to throw an error to simulate a failed repair
    (jsonrepair as jest.Mock).mockImplementation(() => {
      throw new Error("Unable to repair JSON");
    });

    // Spy on console methods
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Assert that an error is thrown
    expect(() => {
      makeArgs(invalidJSON);
    }).toThrow();

    // Assert that console.log and console.error methods were called
    expect(consoleLogSpy).toHaveBeenCalledWith(invalidJSON);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("could not fix JSON"));

    // Restore the original console methods
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();

    // Clear mock implementation
    (jsonrepair as jest.Mock).mockClear();
  });
});