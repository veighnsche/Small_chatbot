import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { LlamaAsserts } from "../decorators/asserts";
import { LlamaMessage } from "../models/chatMessage";
import { callAssistantStream, callChatTitleAssistant } from "../services/assistant";
import { AssistantParamsBody, AssistantUniqueIDBody } from "../types/api/bodies";
import { ChatDocLocals, SseLocals, ThreadLocals } from "../types/api/locals";
import { LlamaReq, LlamaRes } from "../types/api/middleware";
import { withDefaultParameters } from "../utils/assistant";
import { DeltaCombiner } from "../utils/delta";
import { getLast_id } from "../utils/messages";
import { createEventData } from "../utils/stream";


class AssistantMiddleware {
  @LlamaAsserts("thread", "assistantParams", "assistant_id", "chatDocRepo", "sse")
  static async streamAssistantResponse(
    req: LlamaReq<AssistantParamsBody & AssistantUniqueIDBody>,
    res: LlamaRes<ThreadLocals & ChatDocLocals & SseLocals>,
  ): Promise<void> {
    const messages = res.locals.thread;
    const functions = req.body.assistantParams.functions;
    const assistant_uid = req.body.assistant_uid;

    const assistantParams: ChatCompletionCreateParamsNonStreaming = {
      ...req.body.assistantParams,
      messages: LlamaMessage.toChatCompletionMessagesParam(messages),
      functions: functions ? withDefaultParameters(functions) : undefined,
    };

    res.write(`event: START\ndata: ${createEventData("assistant: start", { status: "start", name: "assistant" })}\n\n`);

    const deltas = new DeltaCombiner();

    for await (const { delta, finish_reason } of callAssistantStream(assistantParams, res.locals.sse.id)) {
      if (!finish_reason) {
        res.write(`data: ${JSON.stringify(delta)}\n\n`);
        deltas.appendDelta(delta);
      } else {
        res.write(`event: STOP\ndata: ${createEventData("assistant: stop", {
          name: "assistant",
          status: "finish",
          finish_reason,
        })}\n\n`);
      }
    }

    const assistant_message = await LlamaMessage.fromChatCompletionMessage(
      deltas.assistantMessage,
      getLast_id(messages),
    );

    /**
     * MOVE THIS OUT OF HERE: ID: RACE CONDITION
     */
    await res.locals.chatDocRepo.addMessage(assistant_message);
    res.locals.thread.push(assistant_message);
    res.write(`data: ${JSON.stringify({ assistant_message, assistant_uid })}\n\n`);
    /**
     * MOVE THIS OUT OF HERE: ID: RACE CONDITION
     */
  }

  @LlamaAsserts("thread", "chatDocRepo")
  static async generateTitle(_: LlamaReq, res: LlamaRes<ThreadLocals & ChatDocLocals>): Promise<void> {
    const messages = res.locals.thread;

    const newTitle = await callChatTitleAssistant(messages);
    await res.locals.chatDocRepo.editTitle(newTitle);
  }
}

export default {
  default: {
    stream: AssistantMiddleware.streamAssistantResponse,
  },
  forTitle: {
    call: AssistantMiddleware.generateTitle,
  },
};