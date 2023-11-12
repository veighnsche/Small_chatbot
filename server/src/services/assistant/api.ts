import { OpenAI } from "openai";
import { ChatCompletionChunk } from "openai/resources/chat";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { Stream } from "openai/streaming";
import { IO_AZURE_OPENAI_ENDPOINT, IO_AZURE_OPENAI_KEY, OPENAI_KEY } from "../environmentVariables";

class AssistantApi {
  chatCompletionApi: (params: ChatCompletionCreateParamsNonStreaming) => Promise<Stream<ChatCompletionChunk>>;

  constructor() {
    const openaiKey = OPENAI_KEY;
    const iOazureKey = IO_AZURE_OPENAI_KEY;

    if (!openaiKey && !iOazureKey) {
      throw new Error("Must have either OPENAI_KEY or IO_AZURE_OPENAI_KEY set.");
    }

    if (openaiKey && iOazureKey) {
      throw new Error("Cannot have both OPENAI_KEY and IO_AZURE_OPENAI_KEY set.");
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

    if (iOazureKey) {
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
    const decoder = new TextDecoder();
    let fragment = ""; // we have fragmented messages, so sometimes we need to store the previous chunk

    try {
      while (true) {
        const { done, value: data } = await reader.read();
        if (done) break;
        if (!data) continue;

        const decoded = decoder.decode(data);

        if (fragment) { // if in the last loop we had a fragment, we need to process it first
          fragment += decoded.split("data: ")[0]; // add the first part of the decoded chunk to the fragment
          try {
            yield JSON.parse(fragment.slice(6));
            fragment = "";
          } catch (e) {
            yield* processChunk(fragment); // sometimes the fragmentation is in the "data: " part, so combining them together might make 2 data lines
          }
        }

        yield* processChunk(decoded);
      }
    } finally {
      reader.releaseLock();
    }

    function* processChunk(chunk: string) {
      const jsons = chunk.split(/(?=data: |event: )/);
      for (const jsonString of jsons) {
        if (jsonString.startsWith("data: ")) {
          try {
            yield JSON.parse(jsonString.slice(6));
            fragment = "";
          } catch (e) {
            fragment = jsonString;
          }
        } else if (jsonString.startsWith("event: ")) {
          console.log({ event: jsonString });
        } else if (jsonString.startsWith("data: [DONE]")) {
          yield { done: true }
        }
      }
    }
  }

}

const assistantApi = new AssistantApi();

export const llamaChatCompletion = assistantApi.chatCompletionApi.bind(assistantApi);
