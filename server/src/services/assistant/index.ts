import { JSONSchema7 } from "json-schema";
import { Chat, ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { LlamaMessage } from "../../models/chatMessage";
import { connectionsEventBus } from "../eventBus";
import { llamaChatCompletion, llamaChatCompletionStream } from "./api";
import ChatCompletionCreateParams = Chat.ChatCompletionCreateParams;

export async function* callAssistantStream(
	assistantParams: ChatCompletionCreateParamsNonStreaming,
	sseId: string,
): AsyncGenerator<ChatCompletionChunk.Choice> {
	// Create a stream for chat completions
	const chatCompletionStream = await llamaChatCompletionStream(assistantParams).catch((e: any) => {
		console.error(e);
		throw e;
	});

	// Listen for stop events
	let shouldStop = false;
	connectionsEventBus.on(sseId, () => {
		shouldStop = true;
	});

	// Iterate over the completion stream
	for await (const chunk of chatCompletionStream) {
		if (shouldStop) {
			break;
		}
		if (chunk.choices.length === 0) {
			continue;
		}
		yield chunk.choices[0];
	}
}

export const callChatTitleAssistant = async (chatMessages: LlamaMessage[]): Promise<string> => {
	const messages: ChatCompletionMessage[] = LlamaMessage.toChatCompletionMessagesParam(chatMessages);

	const completion = await llamaChatCompletion({
		messages: [
			{
				role: "system",
				content: "You are a title generator. Your goal is to generate a title for the following conversation.",
			},
			...messages,
		],
		model: "gpt-3.5-turbo",
		max_tokens: 50,
		function_call: { name: "set_title" },
		functions: [
			{
				name: "set_title",
				description: "Set a 3 worded title of the conversation.",
				parameters: <JSONSchema7>{
					type: "object",
					properties: {
						title: {
							type: "string",
							description: "The title of the conversation.",
						},
					},
					required: [
						"title",
					],
				} as ChatCompletionCreateParams.Function["parameters"],
			},
		],
	});

	const message = completion.choices[0].message;
	if (!message.function_call) {
		throw new Error("No function call was returned from the naming assistant.");
	}

	const args = JSON.parse(message.function_call.arguments);
	if (!args.title) {
		throw new Error("No title was returned from the naming assistant.");
	}

	return args.title;
};
