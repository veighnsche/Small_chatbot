import { chatTitleMemo } from "../../selectors/chatTitle.ts";
import { useLlamaSelector } from "../../stores/llamaStore.ts";

export const useLlamaChatHeader = () => {
  const title = useLlamaSelector(chatTitleMemo);

  return {
    title,
  };
}