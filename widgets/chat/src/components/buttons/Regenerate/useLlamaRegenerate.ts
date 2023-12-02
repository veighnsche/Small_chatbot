import { useLlamaDispatch, useLlamaSelector } from "../../../stores/llamaStore.ts";
import { llamaSseRegenerate } from "../../../thunks/llamaSseRegenerate.ts";

export const useLlamaRegenerate = () => {
  const chat_id = useLlamaSelector((state) => state.llamaChat.currentChat_id);
  const dispatch = useLlamaDispatch();

  const onRegenerate = () => {
    dispatch(llamaSseRegenerate());
  };

  const disabled = !chat_id;

  return {
    onRegenerate,
    disabled,
  };
};