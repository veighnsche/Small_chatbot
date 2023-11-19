import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { LlamaChatState } from "../slices/llamaChatSlice";
import { LlamaLoadedSystemMessage } from "../types/LlamaLoadedSystemMessage.ts";
import { LlamaMessage } from "../types/LlamaMessage";

export const SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE = "[END OF SYSTEM MESSAGE TITLE]";

export const addIters = (messages: LlamaMessage[]): LlamaMessage[] => {
  const totalIterMap = new Map<string, number>();
  const currentIterMap = new Map<string, number>();

  // First, calculate the totalIterMap
  for (const message of messages) {
    const count = totalIterMap.get(message.parent_id) || 0;
    totalIterMap.set(message.parent_id, count + 1); // add 1 to the current count
  }

  // Now, calculate currentIter and assign iter properties in the same loop
  return messages.map(message => {
    const currentCount = currentIterMap.get(message.parent_id) || 0;
    currentIterMap.set(message.parent_id, currentCount + 1); // add 1 to the current count

    return {
      ...message,
      iter: {
        current: currentCount + 1, // add 1 to the current count
        total: totalIterMap.get(message.parent_id) || 0,
      },
    };
  });
};

export const makeThreadFromLastMessage = (
  messagesMap: Record<LlamaMessage["id"], LlamaMessage>,
  lastMessageId: LlamaMessage["id"],
): LlamaMessage[] => {
  const thread: LlamaMessage[] = [];
  let currentMessageId = lastMessageId;

  while (currentMessageId !== "-1") {
    const currentMessage = messagesMap[currentMessageId];
    if (currentMessage) {
      thread.unshift(currentMessage);
      currentMessageId = currentMessage.parent_id;
    } else {
      break;
    }
  }

  return thread;
};

export function makeChildrensMap(messages: LlamaMessage[]): Record<LlamaMessage["id"], LlamaMessage["id"][]> {
  return messages.reduce((acc, message) => {
    if (!acc[message.parent_id]) {
      acc[message.parent_id] = [];
    }
    acc[message.parent_id].push(message.id);
    return acc;
  }, {} as Record<LlamaMessage["id"], LlamaMessage["id"][]>);
}

export function traverseToLastMessageId(
  childrensMap: Record<LlamaMessage["id"], LlamaMessage["id"][]>,
  itersMap: LlamaChatState["itersMap"],
  parent_id: string,
) {
  function findLastMessageId(parent_id: string): string {
    const children = childrensMap[parent_id];
    if (!children) return parent_id;

    const iter = itersMap[parent_id] || children.length; // Use the iter value if available, otherwise take the last child

    const childId = children[iter - 1];
    // if the iter is 1 too high (so childId = undefined), then it's regenerating the last message
    if (!childId) return parent_id;

    return findLastMessageId(childId);
  }

  return findLastMessageId(parent_id);
}

export function loadedSystemToLlama(loadedSystemMessage: LlamaLoadedSystemMessage, parent_id: string): LlamaMessage {
  return {
    id: loadedSystemMessage.id,
    parent_id,
    content: loadedSystemMessage.title + SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE + loadedSystemMessage.content,
    role: "system",
    disabled: true,
    iter: {
      current: 1,
      total: 1,
    },
  };
}

export function processSystemMessagesToLlama(thread: LlamaMessage[], loadedSystemMessages: any[]): LlamaMessage[] {
  const lastThreadMessage = thread[thread.length - 1]
    ? thread[thread.length - 1]
    : { id: "-1" };

  const llamaSystemMessages = loadedSystemMessages.reduce(
    (accumulator, message) => {
      const llamaSystemMessage = loadedSystemToLlama(message, accumulator.parent_id);
      accumulator.parent_id = llamaSystemMessage.id;
      accumulator.llamaSystemMessages.push(llamaSystemMessage);
      return accumulator;
    },
    {
      parent_id: lastThreadMessage.id,
      llamaSystemMessages: [] as LlamaMessage[],
    },
  );

  return [...thread, ...llamaSystemMessages.llamaSystemMessages];
}

export function loadedSystemToChatParam(loadedSystemMessage: LlamaLoadedSystemMessage): ChatCompletionMessageParam {
  return {
    role: "system",
    content: loadedSystemMessage.title + SYMBOL_END_OF_SYSTEM_MESSAGE_TITLE + loadedSystemMessage.content,
  };
}

export function findLastAssistantMessageId(messages: LlamaMessage[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      // scenario: [...first messages, assistant, ...last messages] -> assistant id
      return messages[i].id;
    }
  }
  return undefined;
}

export function getLastMessageId(messages: LlamaMessage[], isStreaming: boolean): string {
  const messagesLength = messages.length;
  if (messagesLength === 0) {
    // scenario: [] -> "-1"
    return "-1";
  }

  const lastMessage = messages[messagesLength - 1];

  switch (lastMessage.role) {
    case "assistant":
      // scenario: [...first messages, assistant] -> assistant id
      return lastMessage.id;

    case "system":
      // scenario: [...first messages, system] -> last assistant id || "-1"
      return findLastAssistantMessageId(messages) || "-1";

    case "user":
      if (!isStreaming) {
        // scenario: [...first messages, user] -> last assistant id || "-1"
        return findLastAssistantMessageId(messages) || "-1";
      }

      if (messagesLength > 1) {
        const lastLastMessage = messages[messagesLength - 2];
        if (lastLastMessage.role === "user") {
          // scenario: [...first messages, user, user] -> last assistant id || "-1"
          return findLastAssistantMessageId(messages) || "-1";
        }
        if (lastLastMessage.role === "system") {
          for (let i = messagesLength - 3; i >= 0; i--) {
            switch (messages[i].role) {
              case "system":
                // scenario: [...first messages, ...system, user] -> continue
                continue;

              case "assistant":
                // scenario: [...first messages, assistant, ...system, user] -> assistant id
                return messages[i].id;

              case "user":
                // scenario: [...first messages, user, ...system, user] -> last assistant id || "-1"
                return findLastAssistantMessageId(messages) || "-1";
            }
          }
          // scenario: [...system, user] -> user id
          return lastMessage.id;
        }
        // scenario: [...first messages, assistant, user] -> user id
        return lastMessage.id;
      }
      // scenario: [user] -> user id
      return lastMessage.id;

    default:
      // scenario: [...first messages, unknown] -> "-1"
      return "-1";
  }
}
