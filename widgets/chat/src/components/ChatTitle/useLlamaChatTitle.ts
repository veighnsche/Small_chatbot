import { chatTitleMemo } from "../../selectors/chatTitle.ts";
import { useLlamaSelector } from "../../stores/llamaStore.ts";

export const useLlamaChatTitle = () => {
  const title = useLlamaSelector(chatTitleMemo);

  return {
    title,
  };
}