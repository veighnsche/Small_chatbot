import Refresh from "../../../assets/refresh.svg";
import { IconButton } from "../../utils/IconButton/IconButton.tsx";
import { useLlamaRegenerate } from "./useLlamaRegenerate.ts";

export const Regenerate = () => {
  const { onRegenerate, disabled } = useLlamaRegenerate();

  return (
    <IconButton
      circle
      disabled={disabled}
      onClick={onRegenerate}
      title="Regenerate"
    >
      <img src={Refresh} alt="refresh"/>
    </IconButton>
  );
};