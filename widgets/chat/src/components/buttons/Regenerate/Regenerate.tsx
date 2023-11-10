import { useLlamaRegenerate } from "./useLlamaRegenerate.ts";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";

export const Regenerate = () => {
  const { onRegenerate, disabled } = useLlamaRegenerate();

  return (
    <IconButton
      circle
      disabled={disabled}
      onClick={onRegenerate}
    >
      <img src="http://localhost:3001/icons/refresh.svg" alt="refresh"/>
    </IconButton>
  );
};