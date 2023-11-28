import { ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/chat";

class DeltaCombiner {
	assistantMessage: Partial<ChatCompletionMessage> = {};

	addDelta(delta: ChatCompletionChunk.Choice.Delta) {

	}
}