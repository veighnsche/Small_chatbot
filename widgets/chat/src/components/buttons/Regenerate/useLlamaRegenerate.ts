import { useLlamaStreamingWrite } from "../../../providers/LlamaStreamingProvider.tsx";
import { useLlamaDispatch, useLlamaSelector } from "../../../stores/llamaStore.ts";
import { llamaSseRegenerate } from "../../../thunks/llamaSseRegenerate.ts";

export const useLlamaRegenerate = () => {
  const chatId = useLlamaSelector((state) => state.llamaChat.currentChatId);
  const dispatch = useLlamaDispatch();
  const llamaStreamContext = useLlamaStreamingWrite();

  const onRegenerate = () => {
    dispatch(llamaSseRegenerate({ llamaStreamContext }));
  };

  const disabled = !chatId;

  return {
    onRegenerate,
    disabled,
  };
};