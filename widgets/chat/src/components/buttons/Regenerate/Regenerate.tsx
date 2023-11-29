import Refresh from "../../../assets/refresh.svg";
import { useLlamaSelector } from "../../../stores/llamaStore.ts";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";
import { useLlamaRegenerate } from "./useLlamaRegenerate.ts";

export const Regenerate = () => {
  const { onRegenerate, disabled } = useLlamaRegenerate();

  const isStreaming = useLlamaSelector((state) => !!state.llamaChat.sse_id);

  return (
    <IconButton
      disabled={disabled || isStreaming}
      onClick={onRegenerate}
      title="Regenerate"
    >
      <img src={Refresh} alt="refresh"/>
    </IconButton>
  );
};