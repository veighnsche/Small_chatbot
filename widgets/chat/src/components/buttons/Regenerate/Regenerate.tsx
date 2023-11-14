import Refresh from "../../../assets/refresh.svg";
import { useLlamaSelector } from "../../../stores/llamaStore.ts";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";
import { useLlamaRegenerate } from "./useLlamaRegenerate.ts";

export const Regenerate = () => {
  const { onRegenerate, disabled } = useLlamaRegenerate();

  const isStreaming = useLlamaSelector((state) => !!state.llamaChat.sseId);

  return (
    <IconButton
      circle
      disabled={disabled || isStreaming}
      onClick={onRegenerate}
      title="Regenerate"
      style={{ width: "2rem", height: "2rem" }}
    >
      <img src={Refresh} alt="refresh"/>
    </IconButton>
  );
};