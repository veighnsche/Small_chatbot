import { JSONSchema7 as JSONSchema } from "json-schema";
import OpenAI from "openai";
import ChatCompletionCreateParams = OpenAI.ChatCompletionCreateParams;


export const functionCallMetadataProperties: Record<string, unknown> = {
  explanation: <JSONSchema>{
    type: "string",
    description: "From the assistants perspective, explain your reasoning for choosing this function call.",
  },
};

export const withDefaultParameters = (functionDefinitions: ChatCompletionCreateParams.Function[]): ChatCompletionCreateParams.Function[] => functionDefinitions.map((functionCallInfo) => {
  // Merge the original properties with the metadata properties
  const mergedProperties = {
    ...functionCallMetadataProperties,
    ...functionCallInfo.parameters.properties as {},
  };

  // Merge the original required properties with the metadata properties
  const mergedRequired = [
    "explanation",
    ...functionCallInfo.parameters.required as [],
  ];

  // Return the updated function call info with the merged properties
  return {
    ...functionCallInfo,
    parameters: {
      ...functionCallInfo.parameters,
      properties: mergedProperties,
      required: mergedRequired,
    },
  };
});
