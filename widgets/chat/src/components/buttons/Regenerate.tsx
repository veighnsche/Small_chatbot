import * as React from "react";
import { useLlamaRegenerate } from "../../hooks/components/buttons/useLlamaRegenerate";
import { IconButton } from "../utils/IconButton";

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