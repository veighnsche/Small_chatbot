import { chatTitleMemo } from "../../selectors/chatTitle";
import { useLlamaSelector } from "../../stores/llamaStore";

export const useLlamaChatTitle = () => {
  const title = useLlamaSelector(chatTitleMemo);

  return {
    title,
  };
}