import asserts from "./asserts";
import assistant from "./assistant";
import chat from "./chat";
import error from "./error";
import messages from "./messages";
import repositories from "./repositories";
import sse from "./sse";

export const mw = {
  asserts,
  try: error,
  initialize: {
    chatDocRepo: repositories.chatDoc.initialize,
    sse: sse.initialize,
    messages: messages.initialize
  },
  finalize: {
    sse: sse.finalize,
  },
  chat,
  assistant,
}