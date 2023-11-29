import OpenAI from "openai/index";
import { withDefaultParameters } from "./assistant";
import ChatCompletionCreateParams = OpenAI.ChatCompletionCreateParams;

jest.mock("openai"); // If necessary, to mock the openai SDK

describe("withDefaultParameters", () => {
  const mockFunctionDefinitions: ChatCompletionCreateParams.Function[] = [
    {
      name: "mockFunction1",
      parameters: {
        type: "object",
        properties: {
          param1: { type: "string" },
        },
        required: ["param1"],
      },
    },
    {
      name: "mockFunction2",
      parameters: {
        type: "object",
        properties: {
          param2: { type: "number" },
        },
        required: ["param2"],
      },
    },
  ];

  const expectedResult: ChatCompletionCreateParams.Function[] = [
    {
      name: "mockFunction1",
      parameters: {
        type: "object",
        properties: {
          explanation: {
            type: "string",
            description: "From the assistants perspective, explain your reasoning for choosing this function call.",
          },
          param1: { type: "string" },
        },
        required: ["explanation", "param1"],
      },
    },
    {
      name: "mockFunction2",
      parameters: {
        type: "object",
        properties: {
          explanation: {
            type: "string",
            description: "From the assistants perspective, explain your reasoning for choosing this function call.",
          },
          param2: { type: "number" },
        },
        required: ["explanation", "param2"],
      },
    },
  ];

  test("should append default metadata properties and requirements to each function definition", () => {
    const modifiedFunctionDefinitions = withDefaultParameters(mockFunctionDefinitions);
    expect(modifiedFunctionDefinitions).toEqual(expectedResult);
  });

  test("should not modify the original function definitions", () => {
    withDefaultParameters(mockFunctionDefinitions); // calling to check that original is not modified
    expect(mockFunctionDefinitions).toEqual([
      {
        name: "mockFunction1",
        parameters: {
          type: "object",
          properties: {
            param1: { type: "string" },
          },
          required: ["param1"],
        },
      },
      {
        name: "mockFunction2",
        parameters: {
          type: "object",
          properties: {
            param2: { type: "number" },
          },
          required: ["param2"],
        },
      },
    ]);
  });

  test("should not overwrite existing properties but should append the explanation to them", () => {
    const customFunctionDefinition: ChatCompletionCreateParams.Function[] = [
      {
        name: "mockFunctionWithExplanation",
        parameters: {
          type: "object",
          properties: {
            explanation: {
              type: "string",
              description: "Custom explanation",
            },
          },
          required: [],
        },
      },
    ];

    const modifiedFunctionDefinition = withDefaultParameters(customFunctionDefinition);
    // @ts-expect-error: We know that the function definition has an explanation property
    expect(modifiedFunctionDefinition[0].parameters.properties.explanation).toEqual({
      type: "string",
      description: "Custom explanation",
    });
  });

  // More tests can be written based on additional requirements or edge cases
});