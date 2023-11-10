import { useLlamaDispatch, useLlamaSelector } from "../../../stores/llamaStore";
import { llamaSseRegenerate } from "../../../thunks/llamaSseRegenerate";

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