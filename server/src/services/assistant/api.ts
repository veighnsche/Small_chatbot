import { OpenAI } from "openai";
import { ChatCompletionChunk } from "openai/resources/chat";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { Stream } from "openai/streaming";
import { IO_AZURE_OPENAI_ENDPOINT, IO_AZURE_OPENAI_KEY, OPENAI_KEY } from "../environmentVariables";

class AssistantApi {
  chatCompletionApi: (params: ChatCompletionCreateParamsNonStreaming) => Promise<Stream<ChatCompletionChunk>>;

  constructor() {
    const openaiKey = OPENAI_KEY;
    const azureKey = IO_AZURE_OPENAI_KEY;

    if (!openaiKey && !azureKey) {
      throw new Error("Must have either OPENAI_KEY or AZURE_OPENAI_KEY set.");
    }

    if (openaiKey && azureKey) {
      throw new Error("Cannot have both OPENAI_KEY and AZURE_OPENAI_KEY set.");
    }

    if (openaiKey) {
      console.info("Using openai as assistant api");
      const openai = new OpenAI({
        apiKey: OPENAI_KEY,
      });

      this.chatCompletionApi = (params: ChatCompletionCreateParamsNonStreaming) => openai.chat.completions.create({
        ...params,
        stream: true,
      });
    }

    if (azureKey) {
      console.info("Using iOgpt as assistant api");
      this.chatCompletionApi = async (params: ChatCompletionCreateParamsNonStreaming) => {
        const response = await fetch(IO_AZURE_OPENAI_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "iO-GPT-Subscription-Key": IO_AZURE_OPENAI_KEY,
          },
          body: JSON.stringify({
            ...params,
            stream: true,
          }),
        });

        // Wrap the async generator within a Stream object
        return new Stream(() => this.streamGenerator(response.body), null);
      };
    }
  }

  private async* streamGenerator(stream: ReadableStream): AsyncGenerator<any> {
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        yield* this.uint8ArrayToObjGenerator(value);
      }
    } finally {
      reader.releaseLock();
    }
  }

  private* uint8ArrayToObjGenerator<T extends Record<string, any>>(data: Uint8Array): Generator<T> {
    const decoder = new TextDecoder();
    const jsonBundle = decoder.decode(data);
    const jsons = jsonBundle.split(/(?=data: |event: )/);
    let startOfBrokenJson = "";

    for (const jsonString of jsons) {
      if (startOfBrokenJson) {
        startOfBrokenJson += jsonString.split("\n\n")[0];
        try {
          yield JSON.parse(startOfBrokenJson.slice(6));
        } catch (e) {
          console.error("Failed to parse JSON:", e, startOfBrokenJson);
        } finally {
          startOfBrokenJson = "";
        }
      } else if (jsonString.startsWith("data: ")) {
        try {
          yield JSON.parse(jsonString.slice(6));
        } catch (e) {
          startOfBrokenJson = jsonString;
        }
      } else if (jsonString.startsWith("event: ")) {
        console.log({ event: jsonString });
      } else if (jsonString.startsWith("data: [DONE]")) {
        return;
      }
    }
  }
}

const assistantApi = new AssistantApi();

export const llamaChatCompletion = assistantApi.chatCompletionApi.bind(assistantApi);
