import { useContext } from "react";
import { useLlamaProxy } from "../../private/hooks/useLlamaProxy";
import { LlamaTreeContext } from "../providers/LlamaProvider";
import { IChatWidgetElement } from "../types/IChatWidgetElement";

export const useLlamaTree = (): IChatWidgetElement => {
  const { llamaTree } = useContext(LlamaTreeContext);
  const llamaTreeProxy = useLlamaProxy();

  return llamaTree || llamaTreeProxy;
};