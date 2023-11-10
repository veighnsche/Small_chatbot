import { useLlamaDispatch, useLlamaSelector } from "../../../stores/llamaStore.ts";
import { llamaSseRegenerate } from "../../../thunks/llamaSseRegenerate.ts";

export const useLlamaRegenerate = () => {
  const chatId = useLlamaSelector((state) => state.llamaChat.currentChatId)
  const dispatch = useLlamaDispatch();

  const onRegenerate = () => {
    dispatch(llamaSseRegenerate());
  }

  const disabled = !chatId;

  return {
    onRegenerate,
    disabled,
  };
}