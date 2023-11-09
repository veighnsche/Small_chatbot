import { useLlamaDispatch, useLlamaSelector } from "../../../stores/llamaStore";
import { regenerate } from "../../../thunks/llamaSseRegenerate";

export const useLlamaRegenerate = () => {
  const chatId = useLlamaSelector((state) => state.llamaChat.currentChatId)
  const dispatch = useLlamaDispatch();

  const onRegenerate = () => {
    dispatch(regenerate());
  }

  const disabled = !chatId;

  return {
    onRegenerate,
    disabled,
  };
}