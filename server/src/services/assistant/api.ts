import { OpenAI } from "openai";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsStreaming } from "openai/resources/chat";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions";
import { Stream } from "openai/streaming";
import { IO_AZURE_OPENAI_ENDPOINT, IO_AZURE_OPENAI_KEY, OPENAI_KEY } from "../environmentVariables";

export class AssistantApi {
  chatCompletionStream: (params: ChatCompletionCreateParamsStreaming) => Promise<Stream<ChatCompletionChunk>>;
  chatCompletion: (params: ChatCompletionCreateParamsNonStreaming) => Promise<ChatCompletion>;

  constructor({
    openaiKey,
    iOazureKey,
    iOazureEndpoint,
  }: {
    openaiKey?: string;
    iOazureKey?: string;
    iOazureEndpoint?: string;
  }) {
    if (!openaiKey && !iOazureKey) {
      console.trace("Must have either OPENAI_KEY or IO_AZURE_OPENAI_KEY set.");
      throw new Error("Must have either OPENAI_KEY or IO_AZURE_OPENAI_KEY set.");
    }

    if (openaiKey && iOazureKey) {
      console.trace("Cannot have both OPENAI_KEY and IO_AZURE_OPENAI_KEY set.");
      throw new Error("Cannot have both OPENAI_KEY and IO_AZURE_OPENAI_KEY set.");
    }

    if (openaiKey) {
      console.info("Using openai as assistant api");
      const openai = new OpenAI({
        apiKey: openaiKey,
      });

      this.chatCompletionStream = (params: ChatCompletionCreateParamsBase) => openai.chat.completions.create({
        ...params,
        stream: true,
      });

      this.chatCompletion = (params: ChatCompletionCreateParamsNonStreaming) => openai.chat.completions.create(params);
    }

    if (iOazureKey) {
      console.info("Using iOgpt as assistant api");

      const init = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "iO-GPT-Subscription-Key": iOazureKey,
        },
      };

      this.chatCompletionStream = async (params: ChatCompletionCreateParamsBase) => {
        const controller = new AbortController();
        const response = await fetch(iOazureEndpoint, {
          ...init,
          signal: controller.signal,
          body: JSON.stringify({
            ...params,
            stream: true,
          }),
        }).catch((e) => {
          console.trace(e);
          throw e;
        });

        await this.assertError(response);

        return new Stream(response, controller);
      };

      this.chatCompletion = async (params: ChatCompletionCreateParamsNonStreaming) => {
        const response = await fetch(iOazureEndpoint, {
          ...init,
          body: JSON.stringify(params),
        }).catch((e) => {
          console.trace(e);
          throw e;
        });

        await this.assertError(response);

        return await response.json();
      };
    }
  }

  private async assertError(response: Response) {
    if (response.status < 200 || response.status >= 300) {
      const errorJson = await response.json();
      console.trace(errorJson);
      throw new Error(errorJson.error.message);
    }
  }
}

const assistantApi = new AssistantApi({
  openaiKey: OPENAI_KEY,
  iOazureKey: IO_AZURE_OPENAI_KEY,
  iOazureEndpoint: IO_AZURE_OPENAI_ENDPOINT,
});

export const llamaChatCompletionStream = assistantApi.chatCompletionStream.bind(assistantApi); // what does bind do?
export const llamaChatCompletion = assistantApi.chatCompletion.bind(assistantApi);
